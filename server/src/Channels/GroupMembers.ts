import server from '../Server';
import {deviceBoundQuery, query, updateEntity} from '../Connection';
import {createFilter} from '../logux/Filter';
import {
  GroupMember,
  GroupMembersAcceptInvitation,
  GroupMembersAdd,
  GroupMembersInvitationAccepted,
  GroupMembersInvitationUsed,
  GroupMembersInvite,
  GroupMembersLoad,
  GroupMembersLoaded,
  GroupMembersPatch,
} from '@doko/common';
import {canEditGroup, canReadGroup, updateUserGroupIdsCache} from '../Auth';
import {loadGroups} from './Groups';

async function getGroupForMember(id: string): Promise<string | null> {
  const result = await query<{ groupId: string }>(`SELECT group_id as groupId FROM group_members WHERE id = ?`, [id]);
  return result.length ? result[0].groupId : null;
}

server.channel<GroupMembersLoad>('groupMembers/load', {
  access(ctx, {groupId}) {
    return canReadGroup(ctx.userId!, groupId);
  },
  async init(ctx, {groupId}) {
    await ctx.sendBack<GroupMembersLoaded>({
      groupId,
      type: 'groupMembers/loaded',
      groupMembers: await query<GroupMember>(`SELECT gm.id, gm.name, gm.group_id as groupId, 
                                                     IF(gmd.device_id IS NULL, 0, 1) as isYou
                                                FROM group_members gm
                                           LEFT JOIN group_member_devices gmd ON gmd.group_member_id = gm.id
                                                 AND gmd.device_id = ?
                                               WHERE gm.group_id = ?`, [ctx.userId!, groupId]),
    });
  },
  async filter(ctx, {groupId: subGroupId}) {
    const {addFilter, combinedFilter} = createFilter();
    addFilter<GroupMembersPatch>('groupMembers/patch', (_, {groupId}) => groupId === subGroupId);
    return combinedFilter;
  },
});

server.type<GroupMembersAdd>('groupMembers/add', {
  access(ctx, {groupMember: {groupId}}) {
    return canEditGroup(ctx.userId!, groupId);
  },
  resend() {
    return {channel: 'groupMembers/load'};
  },
  async process(ctx, action) {
    await deviceBoundQuery(ctx.userId!, `INSERT INTO group_members (id, group_id, name) 
                                              VALUES (:id, :groupId, :name)`, {
      ...action.groupMember,
    });
  },
});

server.type<GroupMembersPatch>('groupMembers/patch', {
  async access(ctx, {id, groupId}) {
    const realGroupId = await getGroupForMember(id);
    return realGroupId ? realGroupId === groupId && (await canEditGroup(ctx.userId!, realGroupId)) : false;
  },
  resend() {
    return {channel: 'groupMembers/load'};
  },
  async process(ctx, action) {
    await updateEntity(ctx.userId!, 'group_members', action.id, action.groupMember, ['name']);
  },
});

const inviteTtl = 7 * 60 * 1000; // 7 minutes - the UI will display 5 minutes count down

interface Invite {
  groupId: string;
  groupMemberId: string;
  inviterDeviceId: string;
  invitedOn: number;
}

const invitationTokens = new Map<string, Invite>();

function cleanupTokens(): void {
  invitationTokens.forEach(({invitedOn}, key, map) => {
    if (invitedOn < Date.now() - inviteTtl) {
      map.delete(key);
    }
  });
  setTimeout(cleanupTokens, inviteTtl);
}

setTimeout(cleanupTokens, inviteTtl);

server.type<GroupMembersInvite>('groupMembers/invite', {
  async access(ctx, {groupId, groupMemberId, invitationToken}) {
    return await canEditGroup(ctx.userId!, groupId) //inviter can edit group
      && groupId === await getGroupForMember(groupMemberId) //member is part of group
      && !invitationTokens.has(invitationToken);
  },
  //no resend
  process(ctx, {groupMemberId, groupId, invitationToken}) {
    invitationTokens.set(invitationToken, {
      groupMemberId,
      groupId,
      inviterDeviceId: ctx.userId!,
      invitedOn: Date.now(),
    });
  },
});

server.type<GroupMembersAcceptInvitation>('groupMembers/acceptInvitation', {
  async access(ctx, {token}) {
    const invitation = invitationTokens.get(token);
    return !!invitation && invitation.invitedOn > (Date.now() - inviteTtl);
  },
  //no resend
  async process(ctx, {token}) {
    const {groupId, groupMemberId, inviterDeviceId} = invitationTokens.get(token)!;

    //Check if the user is already connected to a group member:
    const existing = await query(`SELECT gm.id
                                    FROM group_member_devices gmd
                              INNER JOIN group_members gm ON gm.id = gmd.group_member_id AND gm.group_id = :groupId
                                   WHERE gmd.device_id = :deviceId`, {
      groupId,
      deviceId: ctx.userId,
    });
    if (existing.length === 0) {
      await query(`INSERT INTO group_member_devices (group_member_id, device_id, inviter_device_id, invited_on)
                        VALUES (:groupMemberId, :deviceId, :inviterDeviceId, NOW())
                  ON DUPLICATE KEY UPDATE group_member_id = VALUES(group_member_id)`, {
        inviterDeviceId,
        groupMemberId,
        deviceId: ctx.userId,
      });
      await updateUserGroupIdsCache(ctx.userId!, groupId);
    }
    invitationTokens.delete(token);

    //Inform the inviter:
    server.log.add<GroupMembersInvitationUsed>({token, type: 'groupMembers/invitationUsed'},
      {users: [inviterDeviceId]});

    //Inform the invitee:
    const groups = await loadGroups(new Set(groupId));
    await ctx.sendBack<GroupMembersInvitationAccepted>({
      token,
      groupId,
      group: groups[0],
      type: 'groupMembers/invitationAccepted',
    });
  },
});

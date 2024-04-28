import {
  GroupMember,
  GroupMembersAcceptInvitation,
  GroupMembersAdd,
  GroupMembersInvitationAccepted,
  GroupMembersInvitationRejected,
  GroupMembersInvitationUsed,
  GroupMembersInvite,
  GroupMembersLoad,
  GroupMembersLoaded,
  GroupMembersPatch,
  Player,
} from '@doko/common';
import {canEditGroup, canReadGroup, updateUserGroupIdsCache} from '../Auth';
import {
  fromDbValue,
  getTransactional,
  insertEntity,
  insertSingleEntity,
  query,
  updateSingleEntity,
} from '../Connection';
import {groupMemberDevicesDbConfig, groupMembersDbConfig, playersDbConfig} from '../DbTypes';
import {createFilter} from '../logux/Filter';
import server from '../Server';
import {loadGroups} from './Groups';

export async function memberIdsBelongToGroup(groupId: string, memberIds: string[]): Promise<boolean> {
  const rows = await query<{id: string}>(`SELECT id FROM group_members WHERE group_id = ?`, [groupId]);
  const gmIds = rows.reduce((set, {id}) => set.add(id), new Set());
  return memberIds.every((id) => gmIds.has(id));
}

async function getGroupForMember(id: string): Promise<string | null> {
  const result = await query<{groupId: string}>(`SELECT group_id as groupId FROM group_members WHERE id = ?`, [id]);
  return result.length ? result[0].groupId : null;
}

export async function loadGroupMembers(deviceId: string, groupId: string): Promise<GroupMember[]> {
  const groupMembers = await query<GroupMember>(
    `SELECT gm.id, 
              gm.name, 
              gm.group_id as groupId, 
              gm.is_regular as isRegular, 
              IF(gmd.device_id IS NULL, 0, 1) as isYou
         FROM group_members gm
    LEFT JOIN group_member_devices gmd ON gmd.group_member_id = gm.id
          AND gmd.device_id = ?
        WHERE gm.group_id = ?
     GROUP BY gm.id`, [deviceId, groupId]);
  fromDbValue(groupMembers, groupMembersDbConfig.types);
  return groupMembers;
}

server.channel<GroupMembersLoad>('groupMembers/load', {
  access(ctx, {groupId}) {
    return canReadGroup(ctx.userId!, groupId);
  },
  async init(ctx, {groupId}) {
    await ctx.sendBack<GroupMembersLoaded>({
      groupId,
      type: 'groupMembers/loaded',
      groupMembers: await loadGroupMembers(ctx.userId!, groupId),
    });
  },
  filter(ctx, {groupId: subGroupId}) {
    const {addFilter, combinedFilter} = createFilter();
    addFilter<GroupMembersAdd>('groupMembers/add', (_, {groupMember: {groupId}}) => groupId === subGroupId);
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
    await getTransactional(ctx.userId!, async (update) => {
      await insertEntity<GroupMember>(update, groupMembersDbConfig, action.groupMember);
      if (action.newRoundPlayer) {
        await insertEntity<Player>(update, playersDbConfig, action.newRoundPlayer);
      }
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
    await updateSingleEntity<GroupMember>(ctx.userId!, groupMembersDbConfig, action.id, action.groupMember);
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
  async access() {
    return true;
  },
  //no resend
  async process(ctx, {token}) {
    const invitation = invitationTokens.get(token);
    if (!invitation || invitation.invitedOn < (Date.now() - inviteTtl)) {
      await ctx.sendBack<GroupMembersInvitationRejected>({
        token,
        type: 'groupMembers/invitationRejected',
      });
      return;
    }

    const {groupId, groupMemberId, inviterDeviceId} = invitation;

    //Check if the user is already connected to a group member:
    const existing = await query(`SELECT gm.id
                                    FROM group_member_devices gmd
                              INNER JOIN group_members gm ON gm.id = gmd.group_member_id AND gm.group_id = :groupId
                                   WHERE gmd.device_id = :deviceId`, {
      groupId,
      deviceId: ctx.userId,
    });
    if (existing.length === 0) {
      await insertSingleEntity(ctx.userId!, groupMemberDevicesDbConfig, {
        groupMemberId,
        inviterDeviceId,
        deviceId: ctx.userId,
        invitedOn: Math.round(Date.now() / 1000),
      });
      await updateUserGroupIdsCache(ctx.userId!, groupId);
    }
    invitationTokens.delete(token);

    //Inform the inviter:
    server.log.add<GroupMembersInvitationUsed>({token, type: 'groupMembers/invitationUsed'},
      {users: [inviterDeviceId]});

    //Inform the invitee:
    const groups = await loadGroups(new Set([groupId]));
    await ctx.sendBack<GroupMembersInvitationAccepted>({
      token,
      groupId,
      group: groups[0],
      type: 'groupMembers/invitationAccepted',
    });
  },
});

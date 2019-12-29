import server from '../Server';
import {buildPartialUpdateSql, query} from '../Connection';
import {createFilter} from '../logux/Filter';
import {
  generateToken,
  GroupMember,
  GroupMembersAcceptInvitation,
  GroupMembersAdd,
  GroupMembersInvitationAccepted,
  GroupMembersInvitationUsed,
  GroupMembersInvite,
  GroupMembersInvited,
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
      groupMembers: await query<GroupMember>(`SELECT id, name, group_id as groupId 
                                                FROM group_members 
                                               WHERE group_id = ?`, [groupId]),
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
    await query(`INSERT INTO group_members (id, group_id, name, created_by_user_id, created_on) 
                      VALUES (:id, :groupId, :name, :userId, NOW())`, {
      ...action.groupMember,
      userId: ctx.userId,
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
  async process(_ctx, action) {
    const updateKeys = buildPartialUpdateSql(action.groupMember, ['name']);
    if (updateKeys.length) {
      await query(`UPDATE group_members SET ${updateKeys} WHERE id = :id`, {...action.groupMember, id: action.id});
    }
  },
});

const inviteTtl = 7 * 60 * 1000; // 7 minutes - the UI will display 5 minutes count down

interface Invite {
  groupId: string;
  groupMemberId: string;
  inviterUserId: string;
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
  async access(ctx, {groupId, groupMemberId}) {
    return await canEditGroup(ctx.userId!, groupId) //inviter can edit group
      && groupId === await getGroupForMember(groupMemberId); //member is part of group
  },
  //no resend
  async process(ctx, {groupMemberId, groupId}) {
    const invitationToken = generateToken();
    invitationTokens.set(invitationToken, {
      groupMemberId,
      groupId,
      inviterUserId: ctx.userId!,
      invitedOn: Date.now(),
    });
    await ctx.sendBack<GroupMembersInvited>({invitationToken, groupMemberId, groupId, type: 'groupMembers/invited'});
  },
});

server.type<GroupMembersAcceptInvitation>('groupMembers/acceptInvitation', {
  async access(ctx, {token}) {
    const invitation = invitationTokens.get(token);
    return !!invitation && invitation.invitedOn > (Date.now() - inviteTtl);
  },
  //no resend
  async process(ctx, {token}) {
    const {groupId, groupMemberId, inviterUserId} = invitationTokens.get(token)!;
    await query(`INSERT INTO group_member_users (group_member_id, user_id, inviter_user_id, invited_on)
                      VALUES (:groupMemberId, :userId, :inviterUserId, NOW())
                ON DUPLICATE KEY UPDATE group_member_id = VALUES(group_member_id)`, {
      inviterUserId,
      groupMemberId,
      userId: ctx.userId,
    });
    await updateUserGroupIdsCache(ctx.userId!, groupId);
    invitationTokens.delete(token);

    //Inform the inviter:
    server.log.add<GroupMembersInvitationUsed>({token, type: 'groupMembers/invitationUsed'}, {users: [inviterUserId]});

    //Inform the invitee:
    const groups = await loadGroups(new Set(groupId));
    await ctx.sendBack<GroupMembersInvitationAccepted>({
      groupId,
      groupMemberId,
      group: groups[0],
      type: 'groupMembers/invitationAccepted',
    });
  },
});

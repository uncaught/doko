import server from '../Server';
import {generateUuid, Group, GroupsAdd, GroupsLoad, GroupsLoaded, GroupsPatch} from '@doko/common';
import {buildPartialUpdateSql, query} from '../Connection';
import {createFilter} from '../logux/Filter';
import {canEditGroup, clearUserGroupIdsCache, getUserGroupIds} from '../Auth';

server.channel<GroupsLoad>('groups/load', {
  async access() {
    return true; //everyone can read this channel, the result is filtered by membership
  },
  async init(ctx) {
    const groupIds = await getUserGroupIds(ctx.userId!);
    let groups: Group[] = [];
    if (groupIds.size) {
      const ary = `,?`.repeat(groupIds.size).substring(1);
      groups = await query<Group>(`SELECT g.id, g.name FROM groups g WHERE g.id IN (${ary})`, [...groupIds]);
    }
    await ctx.sendBack<GroupsLoaded>({groups, type: 'groups/loaded'});
  },
  async filter(ctx) {
    //TODO: re-test once https://github.com/logux/server/pull/68 is released
    const groupIds = await getUserGroupIds(ctx.userId!);
    const {addFilter, combinedFilter} = createFilter();
    addFilter<GroupsPatch>('groups/patch', (_, {id}) => groupIds.has(id));
    return combinedFilter;
  },
});

server.type<GroupsAdd>('groups/add', {
  async access() {
    return true;
  },
  //No resend needed - no other client may see this group, yet, because no other client is a member
  async process(ctx, action) {
    const groupMemberId = generateUuid();
    await query(`INSERT INTO groups (id, name, created_by_user_id, created_on) VALUES (:id, :name, :userId, NOW())`, {
      ...action.group,
      userId: ctx.userId,
    });
    await query(`INSERT INTO group_members (id, group_id, name, created_by_user_id, created_on)
                      VALUES (:id, :gid, :name, :userId, NOW())`, {
      id: groupMemberId,
      gid: action.group.id,
      name: 'Me',
      userId: ctx.userId,
    });
    await query(`INSERT INTO group_member_users (group_member_id, user_id, inviter_user_id, invited_on) 
                      VALUES (:gmid, :userId, :inviterUserId, NOW())`, {
      gmid: groupMemberId,
      userId: ctx.userId,
      inviterUserId: ctx.userId,
    });
    clearUserGroupIdsCache(ctx.userId!);
  },
});

server.type<GroupsPatch>('groups/patch', {
  access(ctx, {id}) {
    return canEditGroup(ctx.userId!, id);
  },
  resend() {
    return {channel: 'groups/load'};
  },
  async process(_ctx, action) {
    const updateKeys = buildPartialUpdateSql(action.group, ['name']);
    if (updateKeys.length) {
      await query(`UPDATE groups SET ${updateKeys} WHERE id = :id`, {...action.group, id: action.id});
    }
  },
});

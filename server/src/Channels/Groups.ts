import server from '../Server';
import {Group, GroupsAdd, GroupsAll, GroupsLoad, GroupsPatch} from '@doko/common/Entities/Groups';
import {query} from '../Connection';
import {createFilter} from '../logux/Filter';
import {generateUuid} from '@doko/common';
import {intersection} from 'lodash';

async function getUserGroupIds(userId: string): Promise<string[]> {
  const result = await query<{ group_id: string }>(`SELECT DISTINCT gm.group_id
                                FROM group_member_users gmu
                          INNER JOIN group_members gm ON gm.id = gmu.group_member_id
                               WHERE gmu.user_id = :userId`, {userId});
  return result.map(({group_id}) => group_id);
}

server.channel<GroupsLoad, GroupsAll>('groups/load', {
  async access() {
    return true;
  },
  async init(ctx) {
    let result: Group[] = [];
    const groupIds = await getUserGroupIds(ctx.userId!);
    if (groupIds.length) {
      const ary = `,?`.repeat(groupIds.length).substring(1);
      result = await query<Group>(`SELECT g.id, g.name FROM groups g WHERE g.id IN (${ary})`, groupIds);
    }
    await ctx.sendBack({type: 'groups/all', groups: result});
  },
  async filter(ctx) {
    const groupIds = await getUserGroupIds(ctx.userId!);
    const {addFilter, combinedFilter} = createFilter();
    addFilter<GroupsAdd>('groups/add', (_, {group}) => groupIds.includes(group.id));
    addFilter<GroupsPatch>('groups/patch', (_, {id}) => groupIds.includes(id));
    return combinedFilter;
  },
});

server.type<GroupsAdd>('groups/add', {
  async access() {
    return true;
  },
  resend() {
    return {channel: 'groups/load'};
  },
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
    await query(`INSERT INTO group_member_users (group_member_id, user_id) VALUES (:gmid, :userId)`, {
      gmid: groupMemberId,
      userId: ctx.userId,
    });
  },
});

server.type<GroupsPatch>('groups/patch', {
  async access() {
    return true;
  },
  resend() {
    return {channel: 'groups/load'};
  },
  async process(_ctx, action) {
    const updateKeys = intersection(Object.keys(action.group), ['name']).map((key) => `${key} = :${key}`).join(', ');
    if (updateKeys.length) {
      await query(`UPDATE groups SET ${updateKeys} WHERE id = :id`, {
        id: action.id,
        ...action.group,
      });
    }
  },
});

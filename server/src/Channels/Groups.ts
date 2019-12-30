import server from '../Server';
import {Group, GroupsAdd, GroupsLoad, GroupsLoaded, GroupsPatch} from '@doko/common';
import {buildPartialUpdateSql, query} from '../Connection';
import {createFilter} from '../logux/Filter';
import {canEditGroup, getUserGroupIds, updateUserGroupIdsCache} from '../Auth';

export async function loadGroups(groupIds: Set<string>): Promise<Group[]> {
  let groups: Group[] = [];
  if (groupIds.size) {
    const ary = `,?`.repeat(groupIds.size).substring(1);
    groups = await query<Group>(`SELECT g.id, g.name FROM groups g WHERE g.id IN (${ary})`, [...groupIds]);
  }
  return groups;
}

server.channel<GroupsLoad>('groups/load', {
  async access() {
    return true; //everyone can read this channel, the result is filtered by membership
  },
  async init(ctx) {
    const groupIds = await getUserGroupIds(ctx.userId!);
    await ctx.sendBack<GroupsLoaded>({groups: await loadGroups(groupIds), type: 'groups/loaded'});
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
  async access(ctx, action) {
    return action.group.id === action.groupMember.groupId;
  },
  //No resend needed - no other client may see this group, yet, because no other client is a member
  async process(ctx, action) {
    await query(`INSERT INTO groups (id, name, created_by_device_id, created_on) VALUES (:id, :name, :deviceId, NOW())`, {
      ...action.group,
      deviceId: ctx.userId,
    });
    await query(`INSERT INTO group_members (id, group_id, name, created_by_device_id, created_on)
                      VALUES (:id, :groupId, :name, :deviceId, NOW())`, {
      ...action.groupMember,
      deviceId: ctx.userId,
    });
    await query(`INSERT INTO group_member_devices (group_member_id, device_id, inviter_device_id, invited_on) 
                      VALUES (:gmid, :deviceId, :inviterDeviceId, NOW())`, {
      gmid: action.groupMember.id,
      deviceId: ctx.userId,
      inviterDeviceId: ctx.userId,
    });
    await updateUserGroupIdsCache(ctx.userId!, action.group.id);
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

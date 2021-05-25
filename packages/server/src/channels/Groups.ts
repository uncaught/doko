import server from '../Server';
import {Group, GroupsAdd, GroupsAdded, GroupsLoad, GroupsLoaded, GroupsPatch} from '@doko/common';
import {fromDbValue, getTransactional, insertEntity, query, updateSingleEntity} from '../Connection';
import {createFilter} from '../logux/Filter';
import {canEditGroup, getUserGroupIds, getUserGroupIdsSync, updateUserGroupIdsCache} from '../Auth';
import {groupMemberDevicesDbConfig, groupMembersDbConfig, groupsDbConfig} from '../DbTypes';

export async function loadGroups(groupIds: Set<string>): Promise<Group[]> {
  let groups: Group[] = [];
  if (groupIds.size) {
    const ary = `,?`.repeat(groupIds.size).substring(1);
    groups = await query<Group>(`SELECT g.id, g.name, g.settings,
                                        COUNT(r.id) as roundsCount, 
                                        SUM(IF(r.end_date IS NULL, 0, 1)) as completedRoundsCount, 
                                        UNIX_TIMESTAMP(MAX(r.start_date)) as lastRoundUnix 
                                   FROM groups g
                              LEFT JOIN rounds r ON r.group_id = g.id 
                                  WHERE g.id IN (${ary})
                               GROUP BY g.id`, [...groupIds]);
    fromDbValue(groups, groupsDbConfig.types);
  }
  return groups;
}

server.channel<GroupsLoad>('groups/load', {
  async access(ctx) {
    await getUserGroupIds(ctx.userId!); //fill cache for filter(), which is not async, yet
    return true; //everyone can read this channel, the result is filtered by membership
  },
  async init(ctx) {
    const groupIds = await getUserGroupIds(ctx.userId!);
    await ctx.sendBack<GroupsLoaded>({groups: await loadGroups(groupIds), type: 'groups/loaded'});
  },
  filter(ctx) {
    const groupIds = getUserGroupIdsSync(ctx.userId!);
    const {addFilter, combinedFilter} = createFilter();
    addFilter<GroupsPatch>('groups/patch', (_, {id}) => groupIds.has(id));
    return combinedFilter;
  },
});

server.type<GroupsAdd>('groups/add', {
  async access(ctx, action) {
    return action.groupMembers.length === 4
      && Boolean(action.groupMembers[0].isYou)
      && action.groupMembers.every((gm) => action.group.id === gm.groupId);
  },
  //No resend needed - no other client may see this group, yet, because no other client is a member
  async process(ctx, action) {
    await getTransactional(ctx.userId!, async (update) => {
      await insertEntity(update, groupsDbConfig, action.group);
      for (const gm of action.groupMembers) {
        await insertEntity(update, groupMembersDbConfig, gm);
      }
      await insertEntity(update, groupMemberDevicesDbConfig, {
        groupMemberId: action.groupMembers[0].id,
        deviceId: ctx.userId,
        inviterDeviceId: ctx.userId,
        invitedOn: Math.round(Date.now() / 1000),
      });
    });
    await updateUserGroupIdsCache(ctx.userId!, action.group.id);
    await ctx.sendBack<GroupsAdded>({groupId: action.group.id, type: 'groups/added'});
  },
});

server.type<GroupsPatch>('groups/patch', {
  access(ctx, {id}) {
    return canEditGroup(ctx.userId!, id);
  },
  resend() {
    return {channel: 'groups/load'};
  },
  async process(ctx, action) {
    await updateSingleEntity<Group>(ctx.userId!, groupsDbConfig, action.id, action.group);
  },
});

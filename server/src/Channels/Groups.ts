import server from '../Server';
import {Group, GroupsAdd, GroupsAdded, GroupsLoad, GroupsLoaded, GroupsPatch} from '@doko/common';
import {getTransactional, insertEntity, query, updateSingleEntity} from '../Connection';
import {createFilter} from '../logux/Filter';
import {canEditGroup, getUserGroupIds, updateUserGroupIdsCache} from '../Auth';
import {groupMemberDevicesDbConfig, groupMembersDbConfig, groupsDbConfig} from '../DbTypes';

export async function loadGroups(groupIds: Set<string>): Promise<Group[]> {
  let groups: Group[] = [];
  if (groupIds.size) {
    const ary = `,?`.repeat(groupIds.size).substring(1);
    groups = await query<Group>(`SELECT g.id, g.name, g.settings,
                                        COUNT(r.id) as roundsCount, 
                                        UNIX_TIMESTAMP(MAX(r.start_date)) as lastRoundUnix 
                                   FROM groups g
                              LEFT JOIN rounds r ON r.group_id = g.id 
                                  WHERE g.id IN (${ary})
                               GROUP BY g.id`, [...groupIds]);
    groups.forEach((group) => {
      Object.entries(group).forEach(([key, value]) => {
        if (groupsDbConfig.types[key as keyof Group] === 'json') {
          // @ts-ignore
          group[key] = value === null ? null : JSON.parse(value);
        }
      });
    });
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
    await getTransactional(ctx.userId!, async (update) => {
      await insertEntity(update, groupsDbConfig, action.group);
      await insertEntity(update, groupMembersDbConfig, action.groupMember);
      await insertEntity(update, groupMemberDevicesDbConfig, {
        groupMemberId: action.groupMember.id,
        deviceId: ctx.userId,
        inviterDeviceId: ctx.userId,
        invitedOn: Date.now() / 1000,
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

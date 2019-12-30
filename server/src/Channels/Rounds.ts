import server from '../Server';
import {deviceBoundQuery, query, updateEntity} from '../Connection';
import {createFilter} from '../logux/Filter';
import {Round, RoundsAdd, RoundsLoad, RoundsLoaded, RoundsPatch} from '@doko/common';
import {canEditGroup, canReadGroup} from '../Auth';

async function getGroupForRound(id: string): Promise<string | null> {
  const result = await query<{ groupId: string }>(`SELECT group_id as groupId FROM group_members WHERE id = ?`, [id]);
  return result.length ? result[0].groupId : null;
}

server.channel<RoundsLoad>('rounds/load', {
  access(ctx, {groupId}) {
    return canReadGroup(ctx.userId!, groupId);
  },
  async init(ctx, {groupId}) {
    await ctx.sendBack<RoundsLoaded>({
      groupId,
      type: 'rounds/loaded',
      rounds: await query<Round>(`SELECT id, 
                                         group_id as groupId,
                                         UNIX_TIMESTAMP(start_date) as startDate,
                                         UNIX_TIMESTAMP(end_date) as endDate
                                    FROM rounds
                                   WHERE group_id = ?`, [groupId]),
    });
  },
  async filter(ctx, {groupId: subGroupId}) {
    const {addFilter, combinedFilter} = createFilter();
    addFilter<RoundsPatch>('rounds/patch', (_, {groupId}) => groupId === subGroupId);
    return combinedFilter;
  },
});

server.type<RoundsAdd>('rounds/add', {
  access(ctx, {round: {groupId}}) {
    return canEditGroup(ctx.userId!, groupId);
  },
  resend() {
    return {channel: 'rounds/load'};
  },
  async process(ctx, action) {
    await deviceBoundQuery(ctx.userId!, `INSERT INTO rounds (id, group_id, start_date, end_date)
                      VALUES (:id, :groupId, FROM_UNIXTIME(:startDate), FROM_UNIXTIME(:endDate))`, {
      ...action.round,
    });
  },
});

server.type<RoundsPatch>('rounds/patch', {
  async access(ctx, {id, groupId}) {
    const realGroupId = await getGroupForRound(id);
    return realGroupId ? realGroupId === groupId && (await canEditGroup(ctx.userId!, realGroupId)) : false;
  },
  resend() {
    return {channel: 'rounds/load'};
  },
  async process(ctx, action) {
    await updateEntity(ctx.userId!, 'rounds', action.id, action.round, ['startDate', 'endDate'], {
      startDate: 'unix',
      endDate: 'unix',
    });
  },
});

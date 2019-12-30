import server from '../Server';
import {buildPartialUpdateSql, query} from '../Connection';
import {createFilter} from '../logux/Filter';
import {RoundsAdd, RoundsLoad, RoundsPatch} from '@doko/common';
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
    // await ctx.sendBack<RoundsLoaded>({
    //   groupId,
    //   type: 'rounds/loaded',
    //   rounds: await query<Round>(`SELECT id, name, group_id as groupId
    //                                 FROM group_members
    //                                WHERE group_id = ?`, [groupId]),
    // });
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
    // await query(`INSERT INTO group_members (id, group_id, name)
    //                   VALUES (:id, :groupId, :name)`, {
    //   ...action.round,
    // });
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
  async process(_ctx, action) {
    const updateKeys = buildPartialUpdateSql(action.round, []);
    if (updateKeys.length) {
      // await query(`UPDATE group_members SET ${updateKeys} WHERE id = :id`, {...action.round, id: action.id});
    }
  },
});

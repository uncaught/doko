import server from '../Server';
import {fromDbValue, getTransactional, insertEntity, query, updateSingleEntity} from '../Connection';
import {createFilter} from '../logux/Filter';
import {Round, RoundsAdd, RoundsLoad, RoundsLoaded, RoundsPatch, RoundsRemove} from '@doko/common';
import {canEditGroup, canReadGroup} from '../Auth';
import {playersDbConfig, roundsDbConfig} from '../DbTypes';
import {memberIdsBelongToGroup} from './GroupMembers';
import {getGameCountForRound} from './Games';

export async function getGroupForRound(roundId: string): Promise<string | null> {
  const result = await query<{ groupId: string }>(`SELECT group_id as groupId FROM rounds WHERE id = ?`, [roundId]);
  return result.length ? result[0].groupId : null;
}

export async function isRoundOpen(roundId: string): Promise<boolean> {
  const result = await query<{ endDate: number | null }>(`SELECT end_date as endDate FROM rounds WHERE id = ?`, [roundId]);
  return result.length ? result[0].endDate === null : false;
}

export async function loadRounds(groupId: string): Promise<Round[]> {
  const rounds = await query<Round>(`SELECT id, 
                                            group_id as groupId,
                                            UNIX_TIMESTAMP(start_date) as startDate,
                                            UNIX_TIMESTAMP(end_date) as endDate,
                                            data
                                       FROM rounds
                                      WHERE group_id = ?`, [groupId]);
  fromDbValue(rounds, roundsDbConfig.types);
  return rounds;
}

server.channel<RoundsLoad>('rounds/load', {
  access(ctx, {groupId}) {
    return canReadGroup(ctx.userId!, groupId);
  },
  async init(ctx, {groupId}) {
    await ctx.sendBack<RoundsLoaded>({
      groupId,
      type: 'rounds/loaded',
      rounds: await loadRounds(groupId),
    });
  },
  async filter(ctx, {groupId: subGroupId}) {
    const {addFilter, combinedFilter} = createFilter();
    addFilter<RoundsPatch>('rounds/patch', (_, {groupId}) => groupId === subGroupId);
    addFilter<RoundsRemove>('rounds/remove', (_, {groupId}) => groupId === subGroupId);
    return combinedFilter;
  },
});

server.type<RoundsAdd>('rounds/add', {
  access(ctx, {round: {id, groupId}, players}) {
    const memberIds = players.map((p) => p.groupMemberId);
    if (!players.every((player) => player.roundId === id) || !memberIdsBelongToGroup(groupId, memberIds)) {
      return false;
    }
    return canEditGroup(ctx.userId!, groupId);
  },
  resend() {
    return {channel: 'rounds/load'};
  },
  async process(ctx, action) {
    await getTransactional(ctx.userId!, async (update) => {
      await insertEntity(update, roundsDbConfig, action.round);
      await Promise.all(action.players.map((player) => insertEntity(update, playersDbConfig, player)));
    });
  },
});

async function canEditRound(deviceId: string, roundId: string, groupId: string) {
  const realGroupId = await getGroupForRound(roundId);
  return realGroupId === groupId && await canEditGroup(deviceId, realGroupId) && await isRoundOpen(roundId);
}

server.type<RoundsPatch>('rounds/patch', {
  access(ctx, {id, groupId}) {
    return canEditRound(ctx.userId!, id, groupId);
  },
  resend() {
    return {channel: 'rounds/load'};
  },
  async process(ctx, action) {
    await updateSingleEntity<Round>(ctx.userId!, roundsDbConfig, action.id, action.round);
  },
});

server.type<RoundsRemove>('rounds/remove', {
  async access(ctx, {id, groupId}) {
    return await canEditRound(ctx.userId!, id, groupId) && await getGameCountForRound(id) === 0;
  },
  resend() {
    return {channel: 'rounds/load'};
  },
  async process(ctx, {id}) {
    await getTransactional(ctx.userId!, async (update) => {
      await update(`DELETE FROM rounds WHERE id = ?`, [id]);
    });
  },
});

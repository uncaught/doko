import {Player, PlayerSittingOrderPatch, PlayersPatch} from '@doko/common';
import {canEditGroup} from '../Auth';
import {deviceBoundQuery, query, updateSingleEntity} from '../Connection';
import {playersDbConfig} from '../DbTypes';
import server from '../Server';
import {getGroupForRound} from './Rounds';

export function loadPlayers(roundId: string): Promise<Player[]> {
  return query<Player>(
    `SELECT round_id as roundId, 
            group_member_id as groupMemberId,
            sitting_order as sittingOrder,
            joined_after_game_number as joinedAfterGameNumber, 
            left_after_game_number as leftAfterGameNumber 
       FROM round_group_members
      WHERE round_id = ?
   ORDER BY sitting_order`,
    [roundId],
  );
}

async function memberIdsBelongToRound(roundId: string, memberIds: string[]): Promise<boolean> {
  const rows = await query<{gmId: string}>(
    `SELECT group_member_id as gmId 
                                                FROM round_group_members WHERE round_id = ?`,
    [roundId],
  );
  const gmIds = rows.reduce((set, {gmId}) => set.add(gmId), new Set());
  return memberIds.every((id) => gmIds.has(id));
}

server.type<PlayerSittingOrderPatch>('players/patchSittingOrder', {
  async access(ctx, {roundId, order}) {
    const [belongsToRound, realGroupId] = await Promise.all([
      memberIdsBelongToRound(roundId, order),
      getGroupForRound(roundId),
    ]);
    return belongsToRound && realGroupId !== null && (await canEditGroup(ctx.userId!, realGroupId));
  },
  resend() {
    return {channel: 'roundDetails/load'};
  },
  async process(ctx, {roundId, order}) {
    const ary = `,?`.repeat(order.length).substring(1);
    await deviceBoundQuery<Player>(
      ctx.userId!,
      `UPDATE round_group_members
                                                    SET sitting_order = FIELD(group_member_id, ${ary})
                                                  WHERE round_id = ?`,
      [...order, roundId],
    );
  },
});

server.type<PlayersPatch>('players/patch', {
  async access(ctx, {roundId, groupMemberId}) {
    const [groupId, belongsToRound] = await Promise.all([
      getGroupForRound(roundId),
      memberIdsBelongToRound(roundId, [groupMemberId]),
    ]);
    return belongsToRound && groupId !== null && (await canEditGroup(ctx.userId!, groupId));
  },
  resend() {
    return {channel: 'roundDetails/load'};
  },
  async process(ctx, action) {
    await updateSingleEntity<Player>(
      ctx.userId!,
      playersDbConfig,
      {roundId: action.roundId, groupMemberId: action.groupMemberId},
      action.player,
    );
  },
});

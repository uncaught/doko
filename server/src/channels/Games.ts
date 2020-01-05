import server from '../Server';
import {fromDbValue, insertSingleEntity, query, updateSingleEntity} from '../Connection';
import {Game, GamesAdd, GamesPatch} from '@doko/common';
import {canEditGroup} from '../Auth';
import {gamesDbConfig} from '../DbTypes';
import {getGroupForRound} from './Rounds';

export async function getRoundForGame(gameId: string): Promise<string | null> {
  const result = await query<{ roundId: string }>(`SELECT round_id as roundId FROM games WHERE id = ?`, [gameId]);
  return result.length ? result[0].roundId : null;
}

export async function loadGames(roundId: string): Promise<Game[]> {
  const games = await query<Game>(`SELECT id, 
                                          round_id as roundId,
                                          game_number as gameNumber,
                                          dealer_group_member_id as dealerGroupMemberId,
                                          data
                                     FROM games
                                    WHERE round_id = ?`, [roundId]);
  fromDbValue(games, gamesDbConfig.types);
  return games;
}

server.type<GamesAdd>('games/add', {
  async access(ctx, {game}) {
    const groupId = await getGroupForRound(game.roundId);
    return groupId !== null && await canEditGroup(ctx.userId!, groupId);
  },
  resend() {
    return {channel: 'roundDetails/load'};
  },
  async process(ctx, action) {
    await insertSingleEntity<Game>(ctx.userId!, gamesDbConfig, action.game);
  },
});

server.type<GamesPatch>('games/patch', {
  async access(ctx, {id, roundId}) {
    const [realRoundId, realGroupId] = await Promise.all([getRoundForGame(id), getGroupForRound(roundId)]);
    return realRoundId === roundId && realGroupId !== null && await canEditGroup(ctx.userId!, realGroupId);
  },
  resend() {
    return {channel: 'roundDetails/load'};
  },
  async process(ctx, action) {
    await updateSingleEntity<Game>(ctx.userId!, gamesDbConfig, action.id, action.game);
  },
});

import server from '../Server';
import {fromDbValue, getTransactional, insertSingleEntity, query, updateSingleEntity} from '../Connection';
import {
  DeepPartial,
  Game,
  GameData,
  GamesAdd,
  GamesPatch,
  GamesRemove,
  isDuck,
  mergeStates,
  recalcPoints,
} from '@doko/common';
import {canEditGroup} from '../Auth';
import {gamesDbConfig} from '../DbTypes';
import {getGroupForRound, isRoundOpen} from './Rounds';

export async function getRoundForGame(gameId: string): Promise<string | null> {
  const result = await query<{ roundId: string }>(`SELECT round_id as roundId FROM games WHERE id = ?`, [gameId]);
  return result.length ? result[0].roundId : null;
}

export async function isGameOpen(gameId: string): Promise<boolean> {
  const result = await query<{ isComplete: number }>(
      `SELECT IF(json_extract(data, '$.isComplete'), 1, 0) as isComplete FROM games WHERE id = ?`,
    [gameId]);
  return result.length ? +result[0].isComplete === 0 : false;
}

export async function loadGames(roundId: string): Promise<Game[]> {
  const games = await query<Game>(`SELECT id, 
                                          round_id as roundId,
                                          game_number as gameNumber,
                                          dealer_group_member_id as dealerGroupMemberId,
                                          data
                                     FROM games
                                    WHERE round_id = ?
                                 ORDER BY game_number`, [roundId]);
  fromDbValue(games, gamesDbConfig.types);
  return games;
}

export async function getGameCountForRound(roundId: string): Promise<number> {
  const rows = await query<{ c: number }>(`SELECT COUNT(id) as c FROM games WHERE round_id = ?`, [roundId]);
  return rows.length ? +rows[0].c : 0;
}

export async function getLastGameIdOfRound(roundId: string): Promise<string | null> {
  const lastGame = await query<{ id: string }>(`SELECT id FROM games WHERE round_id = ? ORDER BY game_number DESC LIMIT 1`,
    [roundId]);
  return lastGame.length ? lastGame[0].id : null;
}

export async function isLastGameOfRound(gameId: string, roundId: string): Promise<boolean> {
  const lastGameId = await getLastGameIdOfRound(roundId);
  return lastGameId ? lastGameId === gameId : false;
}

server.type<GamesAdd>('games/add', {
  async access(ctx, {game}) {
    const groupId = await getGroupForRound(game.roundId);
    return groupId !== null && await canEditGroup(ctx.userId!, groupId) && await isRoundOpen(game.roundId);
  },
  resend() {
    return {channel: 'roundDetails/load'};
  },
  async process(ctx, action) {
    await insertSingleEntity<Game>(ctx.userId!, gamesDbConfig, action.game);
  },
});

async function canEditGame(deviceId: string, gameId: string, roundId: string, isOpening: boolean = false) {
  const [realRoundId, realGroupId] = await Promise.all([getRoundForGame(gameId), getGroupForRound(roundId)]);
  return realRoundId === roundId
    && realGroupId !== null
    && await canEditGroup(deviceId, realGroupId)
    && await isRoundOpen(roundId)
    && (isOpening || await isGameOpen(gameId));
}

server.type<GamesPatch>('games/patch', {
  access(ctx, {id, roundId, game}) {
    return canEditGame(ctx.userId!, id, roundId, game.data?.isComplete === false);
  },
  resend() {
    return {channel: 'roundDetails/load'};
  },
  async process(ctx, action) {
    const gamePatchMerger = <S>(oldData: S, newData: DeepPartial<S>): S => {
      if (isDuck<GameData>(oldData, 'gameType')) {
        return recalcPoints(mergeStates<GameData>(oldData, newData)) as unknown as S;
      }
      return oldData;
    };
    await updateSingleEntity<Game>(ctx.userId!, gamesDbConfig, action.id, action.game, gamePatchMerger);
  },
});

server.type<GamesRemove>('games/remove', {
  async access(ctx, {id, roundId}) {
    return await canEditGame(ctx.userId!, id, roundId) && await isLastGameOfRound(id, roundId);
  },
  resend() {
    return {channel: 'roundDetails/load'};
  },
  async process(ctx, {id}) {
    await getTransactional(ctx.userId!, async (update) => {
      await update(`DELETE FROM games WHERE id = ?`, [id]);
    });
  },
});

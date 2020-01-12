import {
  Game,
  GameData,
  Games,
  GamesAdd,
  GamesPatch,
  GamesRemove,
  generateUuid,
  getDefaultGameData,
  mergeStates,
  objectContains,
  PatchableGame,
  Player,
  recalcPoints,
  reDealGameTypes,
  RoundDetailsLoaded,
  RoundsAdd,
} from '@doko/common';
import {useFullParams} from '../Page';
import {useDispatch, useSelector} from 'react-redux';
import {arrayToList, createReducer} from './Reducer';
import {State} from './Store';
import {useCallback, useMemo} from 'react';
import {LoguxDispatch} from './Logux';
import {useRound} from './Rounds';
import {difference} from 'lodash';
import {usePlayersWithStats, useRoundParticipatingPlayers} from './Players';
import {useHistory} from 'react-router-dom';
import {useGroup} from './Groups';
import {detectRunNumber} from './Games/DetectRunNumber';
import {detectBockGame} from './Games/DetectBockGame';
import {detectLastGameAndForcedSolo} from './Games/DetectLastGameAndForcedSolo';
import {detectPlayers} from './Games/DetectPlayers';

const {addReducer, combinedReducer} = createReducer<Games>({}, 'games');

addReducer<RoundDetailsLoaded>('roundDetails/loaded',
  (state, {roundId, games}) => ({...state, [roundId]: arrayToList(games)}));

addReducer<GamesAdd>('games/add', (state, {game}) => ({
  ...state,
  [game.roundId]: {
    ...state[game.roundId],
    [game.id]: game,
  },
}));

addReducer<GamesPatch>('games/patch', (state, {id, roundId, game}) => {
  if (state[roundId][id]) {
    const newGame = mergeStates<Game>(state[roundId][id], game);
    if (newGame !== state[roundId][id]) {
      newGame.data = recalcPoints(newGame.data);
      return {
        ...state,
        [roundId]: {
          ...state[roundId],
          [id]: newGame,
        },
      };
    }
  }
  return state;
});

addReducer<GamesRemove>('games/remove', (state, {id, roundId}) => {
  if (state[roundId][id]) {
    const newState = {...state, [roundId]: {...state[roundId]}};
    delete newState[roundId][id];
    return newState;
  }
  return state;
});

addReducer<RoundsAdd>('rounds/add', (state, {round}) => ({...state, [round.id]: {}}));

export const gamesReducer = combinedReducer;

export const gamesSelector = (state: State) => state.games;

export function useSortedGames(): Game[] {
  const {roundId} = useFullParams<{ roundId: string }>();
  const games = useSelector(gamesSelector)[roundId] || {};
  return useMemo(() => Object.values(games).sort((a, b) => a.gameNumber - b.gameNumber), [games]);
}

export function findPlayerIndex(players: Player[], memberId: string): number {
  const index = players.findIndex(({groupMemberId}) => groupMemberId === memberId);
  if (index === -1) {
    throw new Error(`Unkonwn id '${memberId}' in players`);
  }
  return index;
}

function getNextDealer(players: Player[], lastGame: Game): string {
  if (reDealGameTypes.includes(lastGame.data.gameType)) {
    return lastGame.dealerGroupMemberId;
  }
  const index = findPlayerIndex(players, lastGame.dealerGroupMemberId);
  const nextIndex = (index + 1) % players.length;
  return players[nextIndex].groupMemberId;
}

export function useAddGame() {
  const {settings} = useGroup()!;
  const round = useRound()!;
  const currentGames = useSortedGames();
  const roundParticipatingPlayers = useRoundParticipatingPlayers();
  const playersWithStats = usePlayersWithStats();
  const history = useHistory();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((): void => {
    if (!round) {
      throw new Error(`No round`);
    }
    const id = generateUuid();
    const lastGame = currentGames.length ? currentGames[currentGames.length - 1] : null;
    if ((lastGame && lastGame.data.isLastGame) || round.endDate) {
      return;
    }
    const players = roundParticipatingPlayers.filter((p) => p.leftAfterGameNumber === null);
    const nextDealerId = lastGame ? getNextDealer(players, lastGame) : players[0].groupMemberId;
    const data = getDefaultGameData(settings, lastGame);
    data.runNumber = detectRunNumber(currentGames, nextDealerId);
    detectPlayers(data, nextDealerId, players);
    detectBockGame(round.data, data, currentGames, nextDealerId);
    detectLastGameAndForcedSolo(round.data, data, currentGames, nextDealerId, players, playersWithStats);
    const game: Game = {
      id,
      data,
      dealerGroupMemberId: nextDealerId,
      roundId: round.id,
      gameNumber: (lastGame ? lastGame.gameNumber : 0) + 1,
    };
    dispatch.sync<GamesAdd>({game, type: 'games/add'});
    history.push(`/groups/group/${round.groupId}/rounds/round/${round.id}/games/game/${id}`);
  }, [round, currentGames, roundParticipatingPlayers, settings, playersWithStats, dispatch, history]);
}

export function useRemoveGame() {
  const round = useRound()!;
  const game = useGame();
  const currentGames = useSortedGames();
  const history = useHistory();
  const dispatch = useDispatch<LoguxDispatch>();
  const lastGame = currentGames.length ? currentGames[currentGames.length - 1] : null;
  const isLastGame = lastGame === game;

  return useCallback((): void => {
    if (!round || !game) {
      throw new Error(`No round/game`);
    }
    if (round.endDate || game.data.isComplete || !isLastGame) {
      return;
    }
    dispatch.sync<GamesRemove>({id: game.id, roundId: round.id, type: 'games/remove'});
    history.push(`/groups/group/${round.groupId}/rounds/round/${round.id}/games`);
  }, [round, game, isLastGame, dispatch, history]);
}

export function useGame(): Game | undefined {
  const {gameId, roundId} = useFullParams<{ gameId: string; roundId: string }>();
  const games = useSelector(gamesSelector)[roundId] || {};
  return games[gameId];
}

export function usePatchGame() {
  const currentGame = useGame();
  const dispatch = useDispatch<LoguxDispatch>();
  const round = useRound()!;
  return useCallback((game: PatchableGame) => {
    if (!currentGame) {
      throw new Error(`No currentGame`);
    }
    if (round.endDate || (currentGame.data.isComplete && game.data?.isComplete !== false)) {
      return; //block edits on complete games
    }
    if (!objectContains(currentGame, game)) {
      dispatch.sync<GamesPatch>({
        game,
        id: currentGame.id,
        roundId: currentGame.roundId,
        type: 'games/patch',
      });
    }
  }, [currentGame, dispatch, round.endDate]);
}

export function undecided(data: GameData): string[] {
  return difference(data.players, data.re.members, data.contra.members);
}

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
  RoundGames,
  RoundsAdd,
  RoundsPatch,
} from '@doko/common';
import {difference} from 'lodash';
import {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {usePageContext} from '../Page';
import {detectBockGame} from './Games/DetectBockGame';
import {detectLastGameAndForcedSolo} from './Games/DetectLastGameAndForcedSolo';
import {detectPlayers} from './Games/DetectPlayers';
import {detectRunNumber} from './Games/DetectRunNumber';
import {useGroup} from './Groups';
import {LoguxDispatch} from './Logux';
import {usePlayersWithStats, useRoundParticipatingPlayers} from './Players';
import {arrayToList, createReducer} from './Reducer';
import {useLatestGroupRound, useRound} from './Rounds';
import {useSimulatedGame, useSimulatedPatchGame, useSimulation} from './Simulation';
import {State} from './Store';

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
  if (state[roundId]?.[id]) {
    const newGame = mergeStates<Game>(state[roundId]![id]!, game);
    if (newGame !== state[roundId]![id]) {
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
  if (state[roundId]?.[id]) {
    const newState = {...state, [roundId]: {...state[roundId]}};
    delete newState[roundId]![id];
    return newState;
  }
  return state;
});

addReducer<RoundsAdd>('rounds/add', (state, {round}) => ({...state, [round.id]: {}}));

addReducer<RoundsPatch>('rounds/patch', (state, action) => {
  //In case the round was ended prematurely, patch the last game:
  if (action.round.endDate) {
    const roundGames = state[action.id];
    const lastGame = roundGames && getLastGameOfRoundGames(roundGames);
    if (lastGame && !lastGame.data.isLastGame) {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          [lastGame.id]: mergeStates<Game>(lastGame, {data: {isLastGame: true}}),
        },
      };
    }
  }
  return state;
});

export const gamesReducer = combinedReducer;

export const gamesSelector = (state: State) => state.games;

function getLastGameOfRoundGames(roundGames: RoundGames): Game | undefined {
  return Object.values(roundGames).sort((a, b) => b.gameNumber - a.gameNumber)[0];
}

export function useLatestGroupGame(): Game | undefined {
  const round = useLatestGroupRound();
  const games = useSelector(gamesSelector);
  // eslint-disable-next-line
  const roundGames = round && games[round.id] || {};
  return getLastGameOfRoundGames(roundGames);
}

const emptyGames: Games = {};

export function useSortedGames(): Game[] {
  const {roundId} = usePageContext<{roundId: string}>();
  const games = useSelector(gamesSelector)[roundId] || emptyGames;
  return useMemo(() => Object.values(games).sort((a, b) => a.gameNumber - b.gameNumber), [games]);
}

export function findPlayerIndex(players: Player[], memberId: string): number {
  const index = players.findIndex(({groupMemberId}) => groupMemberId === memberId);
  if (index === -1) {
    throw new Error(`Unkonwn id '${memberId}' in players`);
  }
  return index;
}

function getNextDealer(roundParticipatingPlayers: Player[], activePlayers: Player[], lastGame: Game): string {
  if (reDealGameTypes.includes(lastGame.data.gameType)) {
    return lastGame.dealerGroupMemberId;
  }

  const activePlayerMemberIds = new Set(activePlayers.map(({groupMemberId}) => groupMemberId));

  //Because the last dealer could have left the game, we have to use the index from all round participating players:
  let index = findPlayerIndex(roundParticipatingPlayers, lastGame.dealerGroupMemberId);

  //We find the next index after the last dealer, who is still an active player:
  let groupMemberId;
  do {
    index++;
    const nextIndex = index % roundParticipatingPlayers.length;
    groupMemberId = roundParticipatingPlayers[nextIndex]!.groupMemberId;
  } while (!activePlayerMemberIds.has(groupMemberId));

  return groupMemberId;
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
    const gameNumber = (lastGame ? lastGame.gameNumber : 0) + 1;
    const players = roundParticipatingPlayers.filter((p) => p.leftAfterGameNumber === null);
    const nextDealerId = lastGame
      ? getNextDealer(roundParticipatingPlayers, players, lastGame)
      : players[0]!.groupMemberId;
    const data = getDefaultGameData(settings);
    data.runNumber = detectRunNumber(currentGames, nextDealerId, roundParticipatingPlayers);
    detectPlayers(data, nextDealerId, players);
    detectBockGame(round.data, data, currentGames, nextDealerId, gameNumber, roundParticipatingPlayers);
    detectLastGameAndForcedSolo(round.data, data, currentGames, nextDealerId, players, playersWithStats);
    const game: Game = {
      id,
      data,
      gameNumber,
      dealerGroupMemberId: nextDealerId,
      roundId: round.id,
    };
    dispatch.sync<GamesAdd>({game, type: 'games/add'});
    history.push(`/group/${round.groupId}/rounds/round/${round.id}/games/game/${id}`);
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
    history.push(`/group/${round.groupId}/rounds/round/${round.id}/games`);
  }, [round, game, isLastGame, dispatch, history]);
}

function useRealGame(): Game | undefined {
  const {gameId, roundId} = usePageContext<{gameId: string; roundId: string}>();
  const games = useSelector(gamesSelector)[roundId] || {};
  return games[gameId];
}

export function useGame(): Game | undefined {
  return (useSimulation() ? useSimulatedGame : useRealGame)();
}

function useRealPatchGame() {
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

export function usePatchGame(): (game: PatchableGame) => void {
  return (useSimulation() ? useSimulatedPatchGame : useRealPatchGame)();
}

export function undecided(data: GameData): string[] {
  return difference(data.players, data.re.members, data.contra.members);
}

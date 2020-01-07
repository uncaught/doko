import {
  Game,
  Games,
  GamesAdd,
  GamesPatch,
  generateUuid,
  getDefaultGameData,
  GroupMember,
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
import {useGameParticipatingPlayers, usePlayersWithStats} from './Players';
import {useHistory} from 'react-router-dom';
import {useGroupMembers} from './GroupMembers';
import {useGroup} from './Groups';
import {detectRunNumber} from './Games/DetectRunNumber';
import {detectBockGame} from './Games/DetectBockGame';
import {detectLastGameAndForcedSolo} from './Games/DetectLastGameAndForcedSolo';

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
  const currentRound = useRound();
  const currentGames = useSortedGames();
  const players = useGameParticipatingPlayers();
  const playersWithStats = usePlayersWithStats();
  const history = useHistory();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((): void => {
    if (!currentRound) {
      throw new Error(`No currentRound`);
    }
    const id = generateUuid();
    const lastGame = currentGames.length ? currentGames[currentGames.length - 1] : null;
    if ((lastGame && lastGame.data.isLastGame) || round.endDate) {
      return;
    }
    const nextDealerId = lastGame ? getNextDealer(players, lastGame) : players[0].groupMemberId;
    const data = getDefaultGameData(settings, lastGame);
    data.runNumber = detectRunNumber(currentGames, nextDealerId);
    detectBockGame(currentRound.data, data, currentGames, nextDealerId);
    detectLastGameAndForcedSolo(currentRound.data, data, currentGames, nextDealerId, players, playersWithStats);
    const game: Game = {
      id,
      data,
      dealerGroupMemberId: nextDealerId,
      roundId: currentRound.id,
      gameNumber: (lastGame ? lastGame.gameNumber : 0) + 1,
    };
    dispatch.sync<GamesAdd>({game, type: 'games/add'});
    history.push(`/groups/group/${currentRound.groupId}/rounds/round/${currentRound.id}/games/game/${id}`);
  }, [currentGames, currentRound, dispatch, history, players, playersWithStats, round.endDate, settings]);
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

interface GamePlayer {
  member: GroupMember;
  player: Player;
}

interface GamePlayers {
  dealer: GamePlayer;
  all: GamePlayer[];
  undecided: GamePlayer[];
  re: GamePlayer[];
  contra: GamePlayer[];
}

export function useGamePlayers(): GamePlayers | null {
  const game = useGame();
  const members = useGroupMembers();
  const players = useGameParticipatingPlayers();
  if (!game) {
    return null;
  }

  const dealerIndex = findPlayerIndex(players, game.dealerGroupMemberId);

  const gamePlayers: GamePlayers = {
    dealer: {member: members[players[dealerIndex].groupMemberId], player: players[dealerIndex]},
    all: [],
    undecided: [],
    re: [],
    contra: [],
  };

  for (let i = 1; i < 5; i++) {
    const pIndex = (dealerIndex + i) % players.length;
    const player = players[pIndex];
    const gamePlayer: GamePlayer = {member: members[player.groupMemberId], player};
    gamePlayers.all.push(gamePlayer);
    if (game.data.re.members.includes(player.groupMemberId)) {
      gamePlayers.re.push(gamePlayer);
    } else if (game.data.contra.members.includes(player.groupMemberId)) {
      gamePlayers.contra.push(gamePlayer);
    } else {
      gamePlayers.undecided.push(gamePlayer);
    }
  }

  return gamePlayers;
}

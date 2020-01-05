import {
  Game,
  Games,
  GamesAdd,
  GamesPatch,
  GameType,
  generateUuid,
  getDefaultGameData,
  mergeStates,
  Player,
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
import {useActivePlayers} from './Players';
import {useHistory} from 'react-router-dom';

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

addReducer<GamesPatch>('games/patch', (state, {id, roundId, game}) => ({
  ...state,
  [roundId]: {
    ...state[id],
    [id]: mergeStates<Game>(state[roundId][id], game),
  },
}));

addReducer<RoundsAdd>('rounds/add', (state, {round}) => ({...state, [round.id]: {}}));

export const gamesReducer = combinedReducer;

export const gamesSelector = (state: State) => state.games;

export function useSortedGames(): Game[] {
  const {roundId} = useFullParams<{ roundId: string }>();
  const games = useSelector(gamesSelector)[roundId] || {};
  return useMemo(() => Object.values(games).sort((a, b) => a.gameNumber - b.gameNumber), [games]);
}

const reDealGameTypes: GameType[] = ['dutySolo', 'penalty'];

function getNextDealer(players: Player[], lastGame: Game): string {
  if (reDealGameTypes.includes(lastGame.data.gameType)) {
    return lastGame.dealerGroupMemberId;
  }
  const index = players.findIndex(({groupMemberId}) => groupMemberId === lastGame.dealerGroupMemberId);
  if (index === -1) {
    throw new Error(`Unkonwn dealer id '${lastGame.dealerGroupMemberId}' in players`);
  }
  const nextIndex = (index + 1) % players.length;
  return players[nextIndex].groupMemberId;
}

export function useAddGame() {
  const currentRound = useRound();
  const currentGames = useSortedGames();
  const players = useActivePlayers();
  const history = useHistory();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((): void => {
    if (!currentRound) {
      throw new Error(`No currentRound`);
    }
    const id = generateUuid();
    const lastGame = currentGames.length ? currentGames[currentGames.length - 1] : null;
    const game: Game = {
      id,
      roundId: currentRound.id,
      gameNumber: (lastGame ? lastGame.gameNumber : 0) + 1,
      dealerGroupMemberId: lastGame ? getNextDealer(players, lastGame) : players[0].groupMemberId,
      data: getDefaultGameData(),
    };
    dispatch.sync<GamesAdd>({game, type: 'games/add'});
    history.push(`/groups/group/${currentRound.groupId}/rounds/round/${currentRound.id}/games/game/${id}`);
  }, [currentGames, currentRound, dispatch, history, players]);
}

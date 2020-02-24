import {State} from './Store';
import {
  generateUuid,
  getDefaultRoundData,
  mergeStates,
  objectContains,
  PatchableRound,
  Player,
  Round,
  RoundDetailsLoad,
  RoundResults,
  Rounds,
  RoundsAdd,
  RoundsLoad,
  RoundsLoaded,
  RoundsPatch,
  RoundsRemove,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/store/Reducer';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {usePageContext} from '../Page';
import dayjs from 'dayjs';
import {LoguxDispatch} from './Logux';
import {groupsSelector, useGroup} from './Groups';
import {useHistory} from 'react-router-dom';
import {useGroupMembers} from './GroupMembers';
import {useSortedGames} from './Games';
import {usePlayersWithStats} from './Players';

const {addReducer, combinedReducer} = createReducer<Rounds>({}, 'rounds');

addReducer<RoundsLoaded>('rounds/loaded', (state, action) => {
  return {
    ...state,
    [action.groupId]: arrayToList(action.rounds),
  };
});

addReducer<RoundsAdd>('rounds/add', (state, action) => ({
  ...state,
  [action.round.groupId]: {
    ...state[action.round.groupId],
    [action.round.id]: action.round,
  },
}));

addReducer<RoundsPatch>('rounds/patch', (state, action) => {
  if (state[action.groupId]?.[action.id]) {
    return {
      ...state,
      [action.groupId]: {
        ...state[action.groupId],
        [action.id]: mergeStates<Round>(state[action.groupId][action.id], action.round),
      },
    };
  }
  return state;
});

addReducer<RoundsRemove>('rounds/remove', (state, {id, groupId}) => {
  if (state[groupId][id]) {
    const newState = {...state, [groupId]: {...state[groupId]}};
    delete newState[groupId][id];
    return newState;
  }
  return state;
});

export const roundsReducer = combinedReducer;

export const roundsSelector = (state: State) => state.rounds;

export function useLoadRounds() {
  const {groupId} = usePageContext<{ groupId: string }>();
  const group = useSelector(groupsSelector)[groupId];
  //Only subscribe if the group is not new (otherwise the server will respond with `Access denied`:
  useSubscription<RoundsLoad>(group && !group.isNew ? [{channel: 'rounds/load', groupId}] : []);
}

export function useLoadRoundDetails() {
  const {roundId} = usePageContext<{ roundId: string }>();
  useSubscription<RoundDetailsLoad>([{channel: 'roundDetails/load', roundId}]);
}

export function useAddRound() {
  const {id: groupId, settings} = useGroup()!;
  const dispatch = useDispatch<LoguxDispatch>();
  const members = useGroupMembers();
  const sortedMembers = useMemo(() => Object.values(members).sort((a, b) => {
    const compareIsRegular = +b.isRegular - +a.isRegular;
    return compareIsRegular === 0 ? a.name.localeCompare(b.name) : compareIsRegular;
  }), [members]);

  const history = useHistory();
  return useCallback(() => {
    const roundId = generateUuid();
    const round: Round = {
      groupId,
      data: getDefaultRoundData(settings),
      startDate: dayjs().unix(),
      endDate: null,
      id: roundId,
    };
    const players = sortedMembers.reduce<Player[]>((acc, {id, isRegular}, idx) => {
      acc.push({
        roundId,
        groupMemberId: id,
        sittingOrder: idx + 1,
        joinedAfterGameNumber: 0,
        leftAfterGameNumber: isRegular ? null : 0,
      });
      return acc;
    }, []);
    dispatch.sync<RoundsAdd>({
      round,
      players,
      type: 'rounds/add',
    });
    history.push(`/group/${groupId}/rounds/round/${roundId}/players`);
  }, [dispatch, groupId, history, sortedMembers, settings]);
}

export function useRound(): Round | undefined {
  const {groupId, roundId} = usePageContext<{ groupId: string; roundId: string }>();
  const rounds = useSelector(roundsSelector)[groupId] || {};
  return rounds[roundId];
}

export function usePatchRound() {
  const currentRound = useRound();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((round: PatchableRound) => {
    if (!currentRound) {
      throw new Error(`No currentRound`);
    }
    if (currentRound.endDate) {
      return;
    }
    if (!objectContains(currentRound, round)) {
      dispatch.sync<RoundsPatch>({
        round,
        id: currentRound.id,
        groupId: currentRound.groupId,
        type: 'rounds/patch',
      });
    }
  }, [currentRound, dispatch]);
}

export function useFinishRound() {
  const round = useRound();
  const patchRound = usePatchRound();
  const playersWithStats = usePlayersWithStats(true);
  const sortedGames = useSortedGames();
  const history = useHistory();
  const lastGame = sortedGames[sortedGames.length - 1];
  return useCallback(() => {
    if (!round || !lastGame) {
      return;
    }
    const results: RoundResults = {
      gamesCount: sortedGames.length,
      runsCount: lastGame.data.runNumber,
      players: {},
    };
    playersWithStats.forEach(({member, pointBalance, pointDiffToTopPlayer, statistics}) => {
      results.players[member.id] = {pointBalance, pointDiffToTopPlayer, statistics};
    });
    patchRound({
      endDate: Math.round(Date.now() / 1000),
      data: {results},
    });
    history.push(`/group/${round.groupId}/rounds`);
  }, [history, lastGame, patchRound, playersWithStats, round, sortedGames.length]);
}

export function useRemoveRound() {
  const round = useRound();
  const currentGames = useSortedGames();
  const history = useHistory();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((): void => {
    if (!round) {
      throw new Error(`No round`);
    }
    if (round.endDate || currentGames.length) {
      return;
    }
    dispatch.sync<RoundsRemove>({id: round.id, groupId: round.groupId, type: 'rounds/remove'});
    history.push(`/group/${round.groupId}`);
  }, [round, currentGames.length, dispatch, history]);
}

export function useSortedRounds(): Round[] {
  const {groupId} = usePageContext<{ groupId: string }>();
  const rounds = useSelector(roundsSelector)[groupId];
  return useMemo(() => rounds ? Object.values(rounds).sort((a, b) => b.startDate - a.startDate) : [], [rounds]);
}

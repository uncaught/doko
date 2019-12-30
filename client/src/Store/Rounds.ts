import {State} from './Store';
import {
  generateUuid,
  mergeStates,
  objectContains,
  Round,
  Rounds,
  RoundsAdd,
  RoundsLoad,
  RoundsLoaded,
  RoundsPatch,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/Store/Reducer';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {useFullParams} from '../Page';
import dayjs from 'dayjs';
import {LoguxDispatch} from './Logux';

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
        [action.id]: mergeStates(state[action.groupId][action.id], action.round),
      },
    };
  }
  return state;
});

export const roundsReducer = combinedReducer;

export const roundsSelector = (state: State) => state.rounds;

export function useAddRound() {
  const {groupId} = useFullParams<{ groupId: string }>();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((name: string) => {
    if (!name) {
      throw new Error('Invalid name');
    }
    const round: Round = {groupId, startDate: dayjs().unix(), endDate: null, id: generateUuid()};
    return dispatch.sync<RoundsAdd>({round, type: 'rounds/add'});
  }, [dispatch, groupId]);
}

export function useRound(): Round | void {
  const {groupId, roundId} = useFullParams<{ groupId: string; roundId: string }>();
  useSubscription<RoundsLoad>([{channel: 'rounds/load', groupId}]);
  const rounds = useSelector(roundsSelector)[groupId] || {};
  return rounds[roundId];
}

export function usePatchRound() {
  const currentRound = useRound();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((round: Partial<Omit<Round, 'id'>>) => {
    if (!currentRound) {
      throw new Error(`No currentRound`);
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

export function useSortedRounds(): Round[] {
  const {groupId} = useFullParams<{ groupId: string }>();
  useSubscription<RoundsLoad>([{channel: 'rounds/load', groupId}]);
  const rounds = useSelector(roundsSelector)[groupId];
  return useMemo(() => rounds ? Object.values(rounds).sort((a, b) => b.startDate - a.startDate) : [], [rounds]);
}

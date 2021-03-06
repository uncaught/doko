import {State} from './Store';
import {
  mergeStates,
  objectContains,
  PatchableRound,
  Round,
  RoundDetailsLoad,
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
import {LoguxDispatch} from './Logux';
import {groupsSelector} from './Groups';
import {createSelector} from 'reselect';
import {memoize} from 'lodash';

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

export const getRoundByIdSelector = createSelector(
  roundsSelector,
  (rounds) => memoize((id: string): Round | null => {
    for (const round of Object.values(rounds)) {
      if (round[id]) {
        return round[id];
      }
    }
    return null;
  }),
);

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

export function useLatestGroupRound(): Round | undefined {
  const {groupId} = usePageContext<{ groupId: string }>();
  const rounds = useSelector(roundsSelector)[groupId] || {};
  return Object.values(rounds).sort((a, b) => b.startDate - a.startDate)[0];
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

export function useSortedRounds(): Round[] {
  const {groupId} = usePageContext<{ groupId: string }>();
  const rounds = useSelector(roundsSelector)[groupId];
  return useMemo(() => rounds ? Object.values(rounds).sort((a, b) => b.startDate - a.startDate) : [], [rounds]);
}

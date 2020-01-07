import {State} from './Store';
import {
  DeepPartial,
  generateUuid,
  getDefaultRoundData,
  mergeStates,
  objectContains,
  Player,
  Round,
  RoundDetailsLoad,
  Rounds,
  RoundsAdd,
  RoundsLoad,
  RoundsLoaded,
  RoundsPatch,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/store/Reducer';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {useFullParams} from '../Page';
import dayjs from 'dayjs';
import {LoguxDispatch} from './Logux';
import {groupsSelector, useGroup} from './Groups';
import {useHistory} from 'react-router-dom';
import {useSortedGroupMembers} from './GroupMembers';

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

export const roundsReducer = combinedReducer;

export const roundsSelector = (state: State) => state.rounds;

export function useLoadRounds() {
  const {groupId} = useFullParams<{ groupId: string }>();
  const group = useSelector(groupsSelector)[groupId];
  //Only subscribe if the group is not new (otherwise the server will respond with `Access denied`:
  useSubscription<RoundsLoad>(group && !group.isNew ? [{channel: 'rounds/load', groupId}] : []);
}

export function useLoadRoundDetails() {
  const {roundId} = useFullParams<{ roundId: string }>();
  useSubscription<RoundDetailsLoad>([{channel: 'roundDetails/load', roundId}]);
}

export function useAddRound() {
  const {id: groupId, settings} = useGroup()!;
  const dispatch = useDispatch<LoguxDispatch>();
  const members = useSortedGroupMembers();
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
    const players = members.reduce<Player[]>((acc, {id, isRegular}, idx) => {
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
    history.push(`/groups/group/${groupId}/rounds/round/${roundId}/players`);
  }, [dispatch, groupId, history, members, settings]);
}

export function useRound(): Round | undefined {
  const {groupId, roundId} = useFullParams<{ groupId: string; roundId: string }>();
  const rounds = useSelector(roundsSelector)[groupId] || {};
  return rounds[roundId];
}

export function usePatchRound() {
  const currentRound = useRound();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((round: DeepPartial<Omit<Round, 'id'>>) => {
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
  const rounds = useSelector(roundsSelector)[groupId];
  return useMemo(() => rounds ? Object.values(rounds).sort((a, b) => b.startDate - a.startDate) : [], [rounds]);
}

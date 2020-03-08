import {State} from './Store';
import {
  Group,
  GroupMembersInvitationAccepted,
  Groups,
  GroupsAdd,
  GroupsAdded,
  GroupsLoaded,
  GroupsPatch,
  mergeStates,
  objectContains,
  PatchableGroup,
  RoundsAdd,
  RoundsPatch,
  RoundsRemove,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/store/Reducer';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import {usePageContext} from '../Page';
import {LoguxDispatch} from './Logux';
import {useSimulatedGroup, useSimulation} from './Simulation';

const {addReducer, combinedReducer} = createReducer<Groups>({}, 'groups');

addReducer<GroupsLoaded>('groups/loaded', (state, action) => arrayToList(action.groups));

addReducer<GroupsAdd>('groups/add', (state, action) => ({
  ...state,
  [action.group.id]: action.group,
}));

addReducer<GroupsAdded>('groups/added', (state, {groupId}) => {
  if (state[groupId]) {
    const newState = {...state, [groupId]: {...state[groupId]}};
    delete newState[groupId].isNew;
    return newState;
  }
  return state;
});

addReducer<GroupsPatch>('groups/patch', (state, action) => {
  if (state[action.id]) {
    return mergeStates(state, {[action.id]: action.group});
  }
  return state;
});

addReducer<RoundsAdd>('rounds/add', (state, {round: {groupId}}) => {
  if (state[groupId]) {
    return mergeStates(state, {[groupId]: {roundsCount: state[groupId].roundsCount + 1}});
  }
  return state;
});

addReducer<RoundsPatch>('rounds/patch', (state, {groupId, round: {endDate}}) => {
  if (state[groupId] && endDate) {
    return mergeStates(state, {[groupId]: {completedRoundsCount: state[groupId].completedRoundsCount + 1}});
  }
  return state;
});

addReducer<RoundsRemove>('rounds/remove', (state, {groupId}) => {
  if (state[groupId]) {
    return mergeStates(state, {[groupId]: {roundsCount: state[groupId].roundsCount - 1}});
  }
  return state;
});

addReducer<GroupMembersInvitationAccepted>('groupMembers/invitationAccepted', (state, action) => ({
  ...state,
  [action.group.id]: action.group,
}));

export const groupsReducer = combinedReducer;

export const groupsSelector = (state: State) => state.groups;

function useRealGroup(): Group | undefined {
  const {groupId} = usePageContext<{ groupId: string }>();
  const groups = useSelector(groupsSelector);
  return groups[groupId];
}

export function useGroup(): Group | undefined {
  return (useSimulation() ? useSimulatedGroup : useRealGroup)();
}

export function usePatchGroup() {
  const currentGroup = useGroup();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((group: PatchableGroup) => {
    if (!currentGroup) {
      throw new Error(`No currentGroup`);
    }
    if (!objectContains(currentGroup, group)) {
      dispatch.sync<GroupsPatch>({
        group,
        id: currentGroup.id,
        type: 'groups/patch',
      });
    }
  }, [currentGroup, dispatch]);
}

export function useSortedGroups(): Group[] {
  const groups = useSelector(groupsSelector);
  return useMemo(() => Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)), [groups]);
}

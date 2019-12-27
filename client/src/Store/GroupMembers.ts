import {LoguxDispatch, State} from './Store';
import {
  generateUuid,
  GroupMember,
  GroupMembers,
  GroupMembersAdd,
  GroupMembersLoad,
  GroupMembersLoaded,
  GroupMembersPatch,
  mergeStates,
  objectContains,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/Store/Reducer';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {currentGroupIdSelector} from './Ui';

const {addReducer, combinedReducer} = createReducer<GroupMembers>();

addReducer<GroupMembersLoaded>('groupMembers/loaded', (state, action) => {
  return {
    ...state,
    [action.groupId]: arrayToList(action.groupMembers),
  };
});

addReducer<GroupMembersAdd>('groupMembers/add', (state, action) => ({
  ...state,
  [action.groupMember.groupId]: {
    ...state[action.groupMember.groupId],
    [action.groupMember.id]: action.groupMember,
  },
}));

addReducer<GroupMembersPatch>('groupMembers/patch', (state, action) => {
  if (state[action.groupId]?.[action.id]) {
    return {
      ...state,
      [action.groupId]: {
        ...state[action.groupId],
        [action.id]: mergeStates(state[action.groupId][action.id], action.groupMember),
      },
    };
  }
  return state;
});

export const groupMembersReducer = combinedReducer;

export const groupMembersSelector = (state: State) => state.groupMembers;

export function useAddGroupMember() {
  const groupId = useSelector(currentGroupIdSelector);
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((name: string) => {
    if (!name) {
      throw new Error('Invalid name');
    }
    const groupMember: GroupMember = {groupId, name, id: generateUuid()};
    return dispatch.sync<GroupMembersAdd>({groupMember, type: 'groupMembers/add'});
  }, [dispatch, groupId]);
}

export function usePatchGroupMember() {
  const groupId = useSelector(currentGroupIdSelector);
  const {getState} = useStore<State>();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback(async (id: string, groupMember: Partial<Omit<GroupMember, 'id'>>) => {
    const groupMembers = groupMembersSelector(getState())[groupId];
    const currentGroupMember = groupMembers && groupMembers[id];
    if (!currentGroupMember) {
      throw new Error(`GroupMember '${id}' does not exist (on group '${groupId}')`);
    }
    if (!objectContains(currentGroupMember, groupMember)) {
      await dispatch.sync<GroupMembersPatch>({id, groupId, groupMember, type: 'groupMembers/patch'});
    }
  }, [dispatch, getState, groupId]);
}

export function useSortedGroupMembers(): GroupMember[] {
  const groupId = useSelector(currentGroupIdSelector);
  useSubscription<GroupMembersLoad>(['groupMembers/load']);
  const groupMembers = useSelector(groupMembersSelector)[groupId];
  return useMemo(() => groupMembers ? Object.values(groupMembers).sort((a, b) => a.name.localeCompare(b.name)) : [],
    [groupMembers]);
}

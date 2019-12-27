import {LoguxDispatch, State} from './Store';
import {
  generateUuid,
  Group,
  Groups,
  GroupsAdd,
  GroupsLoad,
  GroupsLoaded,
  GroupsPatch,
  mergeStates,
  objectContains,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/Store/Reducer';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';

const {addReducer, combinedReducer} = createReducer<Groups>();

addReducer<GroupsLoaded>('groups/loaded', (state, action) => arrayToList(action.groups));

addReducer<GroupsAdd>('groups/add', (state, action) => ({
  ...state,
  [action.group.id]: action.group,
}));

addReducer<GroupsPatch>('groups/patch', (state, action) => {
  if (state[action.id]) {
    return {
      ...state,
      [action.id]: mergeStates(state[action.id], action.group),
    };
  }
  return state;
});

export const groupsReducer = combinedReducer;

export const groupsSelector = (state: State) => state.groups;

export function useAddGroup() {
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((name: string): string => {
    if (!name) {
      throw new Error('Invalid name');
    }
    const id = generateUuid();
    dispatch.sync<GroupsAdd>({group: {name, id}, type: 'groups/add'});
    return id;
  }, [dispatch]);
}

export function usePatchGroup() {
  const {getState} = useStore<State>();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback(async (id: string, group: Partial<Omit<Group, 'id'>>) => {
    const currentGroup = groupsSelector(getState())[id];
    if (!currentGroup) {
      throw new Error(`Group '${id}' does not exist`);
    }
    if (!objectContains(currentGroup, group)) {
      await dispatch.sync<GroupsPatch>({id, group, type: 'groups/patch'});
    }
  }, [dispatch, getState]);
}

export function useSortedGroups(): Group[] {
  useSubscription<GroupsLoad>(['groups/load']);
  const groups = useSelector(groupsSelector);
  return useMemo(() => Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)), [groups]);
}

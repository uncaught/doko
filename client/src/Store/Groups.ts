import {State} from './Store';
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
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {useFullParams} from '../FullRoute';
import {LoguxDispatch} from './Logux';

const {addReducer, combinedReducer} = createReducer<Groups>({}, 'groups');

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

export function useGroup(): Group | void {
  const {groupId} = useFullParams<{ groupId: string }>();
  useSubscription<GroupsLoad>(['groups/load']);
  const groups = useSelector(groupsSelector) || {};
  return groups[groupId];
}

export function usePatchGroup() {
  const currentGroup = useGroup();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((group: Partial<Omit<Group, 'id'>>) => {
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
  useSubscription<GroupsLoad>(['groups/load']);
  const groups = useSelector(groupsSelector);
  return useMemo(() => Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)), [groups]);
}

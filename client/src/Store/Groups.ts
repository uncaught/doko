import {State} from './Store';
import {
  DeepPartial,
  generateUuid,
  Group,
  GroupMembersInvitationAccepted,
  Groups,
  GroupsAdd,
  GroupsAdded,
  GroupsLoaded,
  GroupsPatch,
  mergeStates,
  objectContains,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/Store/Reducer';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import {useFullParams} from '../Page';
import {LoguxDispatch} from './Logux';
import {useHistory} from 'react-router-dom';
import {defaultGroupSettings} from '@doko/common/src/Entities/Doko';

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
    return {
      ...state,
      [action.id]: mergeStates<Group>(state[action.id], action.group),
    };
  }
  return state;
});

addReducer<GroupMembersInvitationAccepted>('groupMembers/invitationAccepted', (state, action) => ({
  ...state,
  [action.group.id]: action.group,
}));

export const groupsReducer = combinedReducer;

export const groupsSelector = (state: State) => state.groups;

export function useAddGroup() {
  const history = useHistory();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((groupName: string): void => {
    if (!groupName) {
      throw new Error('Invalid name');
    }
    const groupId = generateUuid();
    dispatch.sync<GroupsAdd>({
      group: {
        id: groupId,
        name: groupName,
        isNew: true,
        settings: defaultGroupSettings,
      },
      groupMember: {
        id: generateUuid(),
        groupId: groupId,
        name: 'Me',
        isYou: true,
      },
      type: 'groups/add',
    });
    history.push(`/groups/group/${groupId}/addMembers`);
  }, [dispatch, history]);
}

export function useGroup(): Group | void {
  const {groupId} = useFullParams<{ groupId: string }>();
  const groups = useSelector(groupsSelector);
  return groups[groupId];
}

export function usePatchGroup() {
  const currentGroup = useGroup();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((group: DeepPartial<Omit<Group, 'id'>>) => {
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

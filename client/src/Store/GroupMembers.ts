import {State} from './Store';
import {
  generateToken,
  generateUuid,
  GroupMember,
  GroupMembers,
  GroupMembersAcceptInvitation,
  GroupMembersAdd,
  GroupMembersInvite,
  GroupMembersLoad,
  GroupMembersLoaded,
  GroupMembersPatch,
  GroupsAdd,
  mergeStates,
  objectContains,
  parseInvitationUrl,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/Store/Reducer';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {useHistory} from 'react-router-dom';
import {useFullParams} from '../Page';
import {acceptedInvitationsSelector} from './Ui';
import {LoguxDispatch} from './Logux';
import {groupsSelector} from './Groups';

const {addReducer, combinedReducer} = createReducer<GroupMembers>({}, 'groupMembers');

addReducer<GroupsAdd>('groups/add', (state, action) => ({
  ...state,
  [action.group.id]: {
    [action.groupMember.id]: action.groupMember,
  },
}));

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

export function useLoadGroupMembers() {
  const {groupId} = useFullParams<{ groupId: string }>();
  const group = useSelector(groupsSelector)[groupId];
  //Only subscribe if the group is not new (otherwise the server will respond with `Access denied`:
  useSubscription<GroupMembersLoad>(group && !group.isNew ? [{channel: 'groupMembers/load', groupId}] : []);
}

export function useAddGroupMember() {
  const {groupId} = useFullParams<{ groupId: string }>();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((name: string): void => {
    if (!name) {
      throw new Error('Invalid name');
    }
    const groupMember: GroupMember = {groupId, name, id: generateUuid()};
    dispatch.sync<GroupMembersAdd>({groupMember, type: 'groupMembers/add'});
  }, [dispatch, groupId]);
}

export function useCreateInvitation() {
  const {groupId, groupMemberId} = useFullParams<{ groupId: string; groupMemberId: string }>();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback(async (): Promise<string> => {
    const invitationToken = generateToken();
    await dispatch.sync<GroupMembersInvite>({groupId, groupMemberId, invitationToken, type: 'groupMembers/invite'});
    return invitationToken;
  }, [dispatch, groupId, groupMemberId]);
}

export function useAcceptInvitation() {
  const {getState} = useStore<State>();
  const dispatch = useDispatch<LoguxDispatch>();
  const history = useHistory();
  return useCallback((url: string): boolean => {
    const token = parseInvitationUrl(url);
    if (token) {
      dispatch.sync<GroupMembersAcceptInvitation>({token, type: 'groupMembers/acceptInvitation'}).then(() => {
        const groupId = acceptedInvitationsSelector(getState())[token];
        if (groupId) {
          history.push(`/groups/group/${groupId}`);
        } else {
          console.error('Missing invited groupId');
        }
      });
      return true;
    }
    return false;
  }, [dispatch, getState, history]);
}

export function useGroupMember(): GroupMember | void {
  const {groupId, groupMemberId} = useFullParams<{ groupId: string; groupMemberId: string }>();
  const groupMembers = useSelector(groupMembersSelector)[groupId] || {};
  return groupMembers[groupMemberId];
}

export function usePatchGroupMember() {
  const currentGroupMember = useGroupMember();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((groupMember: Partial<Omit<GroupMember, 'id'>>) => {
    if (!currentGroupMember) {
      throw new Error(`No currentGroupMember`);
    }
    if (!objectContains(currentGroupMember, groupMember)) {
      dispatch.sync<GroupMembersPatch>({
        groupMember,
        id: currentGroupMember.id,
        groupId: currentGroupMember.groupId,
        type: 'groupMembers/patch',
      });
    }
  }, [currentGroupMember, dispatch]);
}

export function useSortedGroupMembers(): GroupMember[] {
  const {groupId} = useFullParams<{ groupId: string }>();
  const members = useSelector(groupMembersSelector)[groupId];
  return useMemo(() => members ? Object.values(members).sort((a, b) => a.name.localeCompare(b.name)) : [], [members]);
}

import {State} from './Store';
import {
  DeepPartial,
  generateToken,
  generateUuid,
  GroupGroupMembers,
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
  Player,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/store/Reducer';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {useHistory} from 'react-router-dom';
import {useFullParams} from '../Page';
import {acceptedInvitationsSelector, rejectedInvitationsSelector} from './Ui';
import {LoguxDispatch} from './Logux';
import {groupsSelector} from './Groups';
import {useSortedRounds} from './Rounds';
import {gamesSelector} from './Games';
import {playersSelector} from './Players';

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
        [action.id]: mergeStates<GroupMember>(state[action.groupId][action.id], action.groupMember),
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
  const rounds = useSortedRounds();
  const games = useSelector(gamesSelector);
  const players = useSelector(playersSelector);
  return useCallback((name: string): void => {
    if (!name) {
      throw new Error('Invalid name');
    }
    const groupMember: GroupMember = {groupId, name, id: generateUuid(), isRegular: true};

    //Add the new member to the last open round if all data is there - otherwise bad luck
    let newRoundPlayer: Player | null = null;
    if (rounds.length && rounds[rounds.length - 1].endDate === null) {
      const lastOpenRoundId = rounds[rounds.length - 1].id;
      const roundGames = games[lastOpenRoundId];
      const roundPlayers = players[lastOpenRoundId];
      if (roundGames && roundPlayers) {
        newRoundPlayer = {
          roundId: lastOpenRoundId,
          groupMemberId: groupMember.id,
          sittingOrder: roundPlayers.length,
          joinedAfterGameNumber: Object.values(roundGames).sort((a, b) => b.gameNumber - a.gameNumber)[0].gameNumber,
          leftAfterGameNumber: null,
        };
      }
    }

    dispatch.sync<GroupMembersAdd>({groupMember, newRoundPlayer, type: 'groupMembers/add'});
  }, [dispatch, games, groupId, players, rounds]);
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
  return useCallback(async (url: string): Promise<boolean> => {
    const token = parseInvitationUrl(url);
    if (token) {
      await dispatch.sync<GroupMembersAcceptInvitation>({token, type: 'groupMembers/acceptInvitation'});
      const state = getState();
      const groupId = acceptedInvitationsSelector(state)[token];
      if (groupId) {
        history.push(`/groups/group/${groupId}`);
        return true;
      } else if (!rejectedInvitationsSelector(state).includes(token)) {
        console.error('Missing invited groupId');
      }
    }
    return false;
  }, [dispatch, getState, history]);
}

export function useGroupMembers(): GroupGroupMembers {
  const {groupId} = useFullParams<{ groupId: string }>();
  return useSelector(groupMembersSelector)[groupId] || {};
}

export function useGroupMember(): GroupMember | undefined {
  const {groupId, groupMemberId} = useFullParams<{ groupId: string; groupMemberId: string }>();
  const groupMembers = useSelector(groupMembersSelector)[groupId] || {};
  return groupMembers[groupMemberId];
}

export function usePatchGroupMember() {
  const currentGroupMember = useGroupMember();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((groupMember: DeepPartial<Omit<GroupMember, 'id'>>) => {
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
  return useMemo(() => members ? Object.values(members).sort((a, b) => {
    const comp = a.name.localeCompare(b.name);
    return comp === 0 ? (+b.isRegular - +a.isRegular) : comp;
  }) : [], [members]);
}

import {State} from './Store';
import {
  generateToken,
  generateUuid,
  GroupGroupMembers,
  GroupMember,
  GroupMemberRoundStats,
  GroupMembers,
  GroupMembersAcceptInvitation,
  GroupMembersAdd,
  GroupMembersInvite,
  GroupMembersLoad,
  GroupMembersLoaded,
  GroupMembersPatch,
  GroupMembersWithRoundStats,
  GroupMemberWithRoundStats,
  GroupsAdd,
  mergeStates,
  objectContains,
  parseInvitationUrl,
  PatchableGroupMember,
  Player,
} from '@doko/common';
import {arrayToList, createReducer} from 'src/store/Reducer';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {useCallback, useMemo} from 'react';
import useSubscription from '@logux/redux/use-subscription';
import {useHistory} from 'react-router-dom';
import {usePageContext} from '../Page';
import {acceptedInvitationsSelector, rejectedInvitationsSelector} from './Ui';
import {LoguxDispatch} from './Logux';
import {groupsSelector} from './Groups';
import {roundsSelector, useSortedRounds} from './Rounds';
import {gamesSelector} from './Games';
import {playersSelector} from './Players';
import {useSimulatedGroupMembers, useSimulation} from './Simulation';
import {createSelector} from 'reselect';
import {cloneDeep, memoize} from 'lodash';
import {addStatistics, createStatistics} from '@doko/common/src/Entities/Statistics';

const {addReducer, combinedReducer} = createReducer<GroupMembers>({}, 'groupMembers');

addReducer<GroupsAdd>('groups/add', (state, action) => {
  const newState = {...state, [action.group.id]: {}};
  action.groupMembers.forEach((gm) => newState[action.group.id][gm.id] = gm);
  return newState;
});

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

const groupMembersSelector = (state: State) => state.groupMembers;

const emptyStats: GroupMemberRoundStats = {
  roundsCount: 0,
  pointBalance: 0,
  pointDiffToTopPlayer: 0,
  euroBalance: null,
  statistics: createStatistics(),
};

const getGroupRoundStatsSelector = createSelector(
  roundsSelector,
  (rounds) => memoize((groupId: string) => {
    const groupRounds = rounds[groupId] || {};
    const memberMap = new Map<string, GroupMemberRoundStats>();
    Object.values(groupRounds).forEach((round) => {
      const {eurosPerPointDiffToTopPlayer, results} = round.data;
      const initEuros = eurosPerPointDiffToTopPlayer === null ? null : 0;
      if (results) {
        Object.entries(results.players).forEach(([memberId, {pointBalance, pointDiffToTopPlayer, statistics}]) => {
          if (!memberMap.has(memberId)) {
            memberMap.set(memberId, cloneDeep({...emptyStats, euroBalance: initEuros}));
          }
          const mapEntry = memberMap.get(memberId)!;
          mapEntry.roundsCount++;
          mapEntry.pointBalance += pointBalance;
          mapEntry.pointDiffToTopPlayer += pointDiffToTopPlayer;
          if (eurosPerPointDiffToTopPlayer !== null) {
            mapEntry.euroBalance! += eurosPerPointDiffToTopPlayer * pointDiffToTopPlayer;
          }
          addStatistics(mapEntry.statistics, statistics);
        });
      }
    });
    return memberMap;
  }),
);

export const getGroupMembersWithRoundStatsSelector = createSelector(
  groupMembersSelector,
  getGroupRoundStatsSelector,
  (groupMembers, getGroupRoundStats) => memoize((groupId: string): GroupMembersWithRoundStats => {
    const members = groupMembers[groupId] || {};
    const groupRoundStats = getGroupRoundStats(groupId);
    return Object.entries(members).reduce<GroupMembersWithRoundStats>((acc, [memberId, member]) => {
      const stats = groupRoundStats.get(memberId) || emptyStats;
      acc[memberId] = {
        ...member,
        ...stats,
      };
      return acc;
    }, {});
  }),
);

export function useLoadGroupMembers() {
  const {groupId} = usePageContext<{groupId: string}>();
  const group = useSelector(groupsSelector)[groupId];
  //Only subscribe if the group is not new (otherwise the server will respond with `Access denied`:
  useSubscription<GroupMembersLoad>(group && !group.isNew ? [{channel: 'groupMembers/load', groupId}] : []);
}

export function useAddGroupMember() {
  const {groupId} = usePageContext<{groupId: string}>();
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
  const {groupId, groupMemberId} = usePageContext<{groupId: string; groupMemberId: string}>();
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
        history.push(`/group/${groupId}`);
        return true;
      } else if (!rejectedInvitationsSelector(state).includes(token)) {
        console.error('Missing invited groupId');
      }
    }
    return false;
  }, [dispatch, getState, history]);
}

function useRealGroupMembers(): GroupMembersWithRoundStats {
  const {groupId} = usePageContext<{groupId: string}>();
  return useSelector(getGroupMembersWithRoundStatsSelector)(groupId) || {};
}

export function useGroupMembers(): GroupGroupMembers {
  return (useSimulation() ? useSimulatedGroupMembers : useRealGroupMembers)();
}

export function useGroupMember(): GroupMemberWithRoundStats | undefined {
  const {groupId, groupMemberId} = usePageContext<{groupId: string; groupMemberId: string}>();
  const groupMembers = useSelector(getGroupMembersWithRoundStatsSelector)(groupId) || {};
  return groupMembers[groupMemberId];
}

export function usePatchGroupMember() {
  const currentGroupMember = useGroupMember();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((groupMember: PatchableGroupMember) => {
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

export function useSortedGroupMembers(): GroupMemberWithRoundStats[] {
  const {groupId} = usePageContext<{groupId: string}>();
  const members = useSelector(getGroupMembersWithRoundStatsSelector)(groupId);
  return useMemo(() => members
    ? Object.values(members)
      .sort((a, b) => (b.pointDiffToTopPlayer - a.pointDiffToTopPlayer) || a.name.localeCompare(b.name))
    : [], [members]);
}

export function useMemberInitials(): Record<string, string> {
  const memberList = useGroupMembers();
  return useMemo(() => {
    const members = Object.values(memberList);
    const maxLength = Math.max(...members.map(({name}) => name.length));


    const initials = members.reduce<Record<string, string>>((acc, member) => {
      acc[member.id] = member.name[0];
      return acc;
    }, {});

    for (let i = 1; i < maxLength; i++) {
      const mappedByInitials = Object.entries(initials).reduce<Map<string, string[]>>((acc, [id, initial]) => {
        acc.set(initial, acc.get(initial) || []);
        acc.get(initial)!.push(id);
        return acc;
      }, new Map());

      mappedByInitials.forEach((ids) => {
        if (ids.length > 1) {
          ids.forEach((id) => {
            const char = memberList[id]!.name[i];
            if (char) {
              initials[id] = `${initials[id][0]}${char}`;
            }
          });
        }
      });
    }

    return initials;
  }, [memberList]);
}
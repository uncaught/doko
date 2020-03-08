import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {LoguxDispatch} from '../Logux';
import {useCallback} from 'react';
import {defaultGroupSettings, generateUuid, GroupMember, GroupsAdd} from '@doko/common';

function createMember(groupId: string, isYou: boolean, num: number): GroupMember {
  return {
    groupId,
    isYou,
    id: generateUuid(),
    name: `Spieler ${num}`,
    isRegular: true,
  };
}

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
        lastRoundUnix: null,
        roundsCount: 0,
        completedRoundsCount: 0,
      },
      groupMembers: [
        createMember(groupId, true, 1),
        createMember(groupId, false, 2),
        createMember(groupId, false, 3),
        createMember(groupId, false, 4),
      ],
      type: 'groups/add',
    });
    history.push(`/group/${groupId}`);
  }, [dispatch, history]);
}

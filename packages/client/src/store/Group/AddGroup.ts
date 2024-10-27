import {defaultGroupSettings, generateUuid, GroupMember, GroupsAdd} from '@doko/common';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {LoguxDispatch} from '../Logux';

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
  const navigate = useNavigate();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback(
    (groupName: string): void => {
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
      navigate(`/group/${groupId}`);
    },
    [dispatch, navigate],
  );
}

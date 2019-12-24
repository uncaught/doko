import {generateUuid, Group} from '@doko/common';
import {useDispatch, useSelector} from 'react-redux';
import useSubscription from '@logux/redux/use-subscription';
import {groupsSelector} from 'src/Store/Groups';
import {LoguxDispatch} from 'src/Store/Store';
import {GroupsAdd, GroupsRename} from '@doko/common/Actions';
import {useCallback} from 'react';

export function useAddGroup() {
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((name: string) => {
    if (!name) {
      throw new Error('Invalid name');
    }
    const group: Group = {name, id: generateUuid()};
    return dispatch.sync<GroupsAdd>({group, type: 'groups/add'});
  }, [dispatch]);
}

export function useRenameGroup() {
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((groupId: string, name: string) => {
    if (!name) {
      throw new Error('Invalid name');
    }
    return dispatch.sync<GroupsRename>({groupId, name, type: 'groups/rename'});
  }, [dispatch]);
}

export function useAllGroups(): [boolean, Group[]] {
  const isLoading = useSubscription(['groups/load']);
  const groups = useSelector(groupsSelector);
  return [isLoading, groups];
}

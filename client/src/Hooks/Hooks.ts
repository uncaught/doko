import {generateUuid} from '@doko/common';
import {useDispatch, useSelector} from 'react-redux';
import useSubscription from '@logux/redux/use-subscription';
import {groupsSelector} from 'src/Store/Groups';
import {LoguxDispatch} from 'src/Store/Store';
import {useCallback, useMemo} from 'react';
import {Group, GroupsAdd, GroupsPatch} from '@doko/common/Entities/Groups';

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

export function usePatchGroup() {
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((id: string, group: Partial<Omit<Group, 'id'>>) => {
    return dispatch.sync<GroupsPatch>({id, group, type: 'groups/patch'});
  }, [dispatch]);
}

export function useSortedGroups(): [boolean, Group[]] {
  const isLoading = useSubscription(['groups/load']);
  const groups = useSelector(groupsSelector);
  return useMemo(() => [isLoading, Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))],
    [isLoading, groups]);
}

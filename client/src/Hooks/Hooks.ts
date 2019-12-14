import {generateUuid, Group, groupsSelector, LoguxDispatch} from '@doko/common';
import {useDispatch, useSelector} from 'react-redux';
import useSubscription from '@logux/redux/use-subscription';

export function useAddGroup() {
  const dispatch = useDispatch<LoguxDispatch>();
  return (name: string) => {
    if (!name) {
      throw new Error('Invalid');
    }
    const group: Group = {name, id: generateUuid()};
    return dispatch.sync({group, type: 'groups/add'});
  };
}

export function useAllGroups(): [boolean, Group[]] {
  const isLoading = useSubscription(['groups/all']);
  const groups = useSelector(groupsSelector);
  return [isLoading, groups];
}

import {State} from './Store';
import {Groups, GroupsAdd, GroupsLoaded, GroupsPatch} from '@doko/common/Entities/Groups';
import {arrayToList, createReducer} from 'src/Store/Reducer';
import {mergeStates} from '@doko/common';

const {addReducer, combinedReducer} = createReducer<Groups>();

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

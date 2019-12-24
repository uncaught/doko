import {State} from './Store';
import {Group} from '@doko/common';
import {GroupsAdd, GroupsAll, GroupsRename} from '@doko/common/Actions';
import {createReducer} from 'src/Store/CreateReducer';

const emptyGroups: Group[] = [];

const {addReducer, combinedReducer} = createReducer<Group[]>(emptyGroups);

addReducer<GroupsAll>('groups/all', (state, action) => [...action.groups]);
addReducer<GroupsAdd>('groups/add', (state, action) => [...state, action.group]);
addReducer<GroupsRename>('groups/rename', (state, action) => {
  let newState = state;
  const idx = state.findIndex((group) => group.id === action.groupId);
  if (idx >= 0) {
    newState = [...state];
    newState[idx] = {...newState[idx], name: action.name};
  }
  return newState;
});

export const groupsReducer = combinedReducer;

export const groupsSelector = (state: State) => state.groups;

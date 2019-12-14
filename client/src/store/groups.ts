import {AnyAction} from 'redux';
import {State} from './store';

export interface Group {
  id: string;
  name: string;
}

const emptyGroups: Group[] = [];

export function reducer(state: Group[] = emptyGroups, action: AnyAction): Group[] {
  let newState = state;

  if (action.type === 'group/add') {
    newState = [...state, action.group];

  } else if (action.type === 'group/rename') {
    const idx = state.findIndex((group) => group.id === action.groupId);
    if (idx >= 0) {
      newState = [...state];
      newState[idx] = {...newState[idx], name: action.name};
    }
  }

  return newState;
}

export const groupsSelector = (state: State) => state.groups;

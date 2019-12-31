import {combineReducers} from 'redux';
import {groupsReducer as groups} from './Groups';
import {roundsReducer as rounds} from './Rounds';
import {groupMembersReducer as groupMembers} from './GroupMembers';
import {Ui, uiReducer as ui} from './Ui';
import {GroupMembers, Groups, Rounds} from '@doko/common';

export interface State {
  groups: Groups;
  groupMembers: GroupMembers;
  rounds: Rounds;
  ui: Ui;
}

export const storeReducer = combineReducers<State>({
  groups,
  groupMembers,
  rounds,
  ui,
});

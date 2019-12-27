import {Action, AnyAction, combineReducers} from 'redux';
import {groupsReducer as groups} from './Groups';
import {groupMembersReducer as groupMembers} from './GroupMembers';
import {Ui, uiReducer as ui} from './Ui';
import {GroupMembers, Groups} from '@doko/common';

export interface LoguxDispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;

  crossTab: <T extends A>(action: T, meta?: object) => Promise<void>;
  local: <T extends A>(action: T, meta?: object) => Promise<void>;
  sync: <T extends A>(action: T, meta?: object) => Promise<void>;
}

export interface State {
  groups: Groups;
  groupMembers: GroupMembers;
  ui: Ui;
}

export const storeReducer = combineReducers<State>({
  groups,
  groupMembers,
  ui,
});

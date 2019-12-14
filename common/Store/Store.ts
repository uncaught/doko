import {Action, AnyAction, combineReducers} from 'redux';
import {Group, groupsReducer as groups} from './Groups';
import {Ui, uiReducer as ui} from './Ui';

export interface LoguxDispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;

  crossTab: <T extends A>(action: T, meta?: object) => Promise<void>;
  local: <T extends A>(action: T, meta?: object) => Promise<void>;
  sync: <T extends A>(action: T, meta?: object) => Promise<void>;
}

export interface State {
  groups: Group[];
  ui: Ui;
}

export const storeReducer = combineReducers<State>({
  groups,
  ui,
});

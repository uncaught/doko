import {combineReducers} from 'redux';
import {Group, reducer as groups} from './groups';
import {reducer as ui, Ui} from './ui';

export interface State {
  groups: Group[];
  ui: Ui;
}

export const reducer = combineReducers<State>({
  groups,
  ui,
});

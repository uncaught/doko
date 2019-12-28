import {AnyAction} from 'redux';
import {DeepPartial, mergeStates} from '@doko/common';
import * as LocalStorage from '../LocalStorage';
import {isAction} from './Reducer';

export interface Ui {
}

export interface UiSet {
  type: 'ui/set';
  ui: DeepPartial<Ui>;
}

const syncKeys: string[] = [];

function syncToLocalStorage(oldState: Ui, newState: Ui): void {
  Object.entries(oldState).forEach(([key, oldValue]) => {
    const newValue = newState[key as keyof Ui];
    if (oldValue !== newValue && syncKeys.includes(key)) {
      LocalStorage.set(`ui.${key}`, newValue);
    }
  });
}

function syncFromLocalStorage(state: Ui): Ui {
  let newState = state;
  syncKeys.forEach((key) => {
    const parsedValue = LocalStorage.get(`ui.${key}`);
    if (parsedValue !== null) {
      newState = {...newState, [key]: parsedValue};
    }
  });
  return newState;
}

const initial: Ui = {};

export function uiReducer(state?: Ui, action: AnyAction = {type: ''}): Ui {
  let newState = state;
  if (typeof state === 'undefined') {
    newState = syncFromLocalStorage(initial);
  } else if (isAction<UiSet>(action, 'ui/set')) {
    newState = mergeStates(state, action.ui);
    syncToLocalStorage(state, newState);
  }
  return newState!;
}

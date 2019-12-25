import {Action, Reducer} from 'redux';

export function createReducer<S>(defaultState: any = {}) {
  const map = new Map<string, Reducer<S>>();

  const addReducer = <A extends Action>(type: A['type'], reducer: (state: S, action: A) => S) => {
    if (!type) {
      throw new Error('Empty type');
    }
    // @ts-ignore
    map.set(type, reducer);
  };

  const combinedReducer = (state = defaultState, action: Action = {type: ''}) => {
    let newState = state;
    const reducer = map.get(action.type);
    if (reducer) {
      newState = reducer(newState, action);
    }
    return newState;
  };

  return {addReducer, combinedReducer};
}

export function arrayToList<O extends { id: string }>(array: O[]): { [id: string]: O } {
  return array.reduce<{ [id: string]: O }>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

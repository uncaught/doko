import {Action, Reducer} from 'redux';

export function createReducer<S>(defaultState: any = {}) {
  const map = new Map<string, Reducer<S>>();

  // @ts-ignore
  const addReducer = <A extends Action>(type: A['type'], reducer: (state: S, action: A) => S) => map.set(type, reducer);

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

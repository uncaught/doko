import {createPromise} from '@doko/common';
import {useCallback} from 'react';
import {useStore} from 'react-redux';
import {Action, AnyAction} from 'redux';
import {isAction} from './Reducer';
import {State} from './Store';

export interface LoguxDispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;

  crossTab: <T extends A>(action: T, meta?: object) => Promise<void>;
  local: <T extends A>(action: T, meta?: object) => Promise<void>;
  sync: <T extends A>(action: T, meta?: object) => Promise<void>;
}

export function useLoguxClientOnce() {
  // @ts-ignore
  const {client} = useStore<State>();
  return useCallback(
    async <A extends Action>(type: A['type'], timeout: number = 1000): Promise<A> => {
      const [prom, resolve, reject] = createPromise<A>();
      setTimeout(reject, timeout);
      const listener = client.on('add', (action: Action) => {
        if (isAction<A>(action, type)) {
          resolve(action);
        }
      });
      try {
        return await prom;
      } finally {
        listener();
      }
    },
    [client],
  );
}

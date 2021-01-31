import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
// @ts-ignore
import createLoguxCreator from '@logux/redux/create-logux-creator';
// @ts-ignore
import badge from '@logux/client/badge';
// @ts-ignore
import badgeStyles from '@logux/client/badge/default';
// @ts-ignore
import badgeMessages from '@logux/client/badge/en';
// @ts-ignore
import log from '@logux/client/log';
import { storeReducer } from './store/Store';
import { getAuth } from './Auth';
import { BrowserRouter as Router } from 'react-router-dom';
import { getLoguxPrefix, setBuildTime } from './LocalStorage';

function initLogux(buildTime: number) {
  const isDev = process.env.NODE_ENV === 'development';
  const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const createStore = createLoguxCreator({
    prefix: getLoguxPrefix(),
    subprotocol: '1.0.0',
    server: `${wsProto}://${window.location.hostname}/api`,
    ...getAuth(),
  });

  // @ts-ignore
  const enhancer = isDev && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ name: 'Doko' });
  const store = createStore(storeReducer, enhancer);
  badge(store.client, { messages: badgeMessages, styles: badgeStyles });
  if (isDev) {
    log(store.client);
  }
  store.client.start();

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
}

export async function initApp() {
  const response = await fetch('/version.json', { cache: "no-cache" });
  const { buildTime } = await response.json() as { buildTime: number };
  localStorage.setItem('buildTime', buildTime.toString());
  setBuildTime(buildTime);
  initLogux(buildTime);
}
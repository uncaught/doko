import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
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
import {storeReducer} from './store/Store';
import {getAuth} from './Auth';
import {BrowserRouter as Router} from 'react-router-dom';
import {getLoguxPrefix, setBuildTime} from './LocalStorage';
import {initDarkMode} from './DarkMode';
import DndContext from './DndContext';

function initLogux() {
  const isDev = process.env.NODE_ENV === 'development';
  const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const createStore = createLoguxCreator({
    prefix: getLoguxPrefix(),
    subprotocol: '1.0.0',
    server: `${wsProto}://${window.location.hostname}/ws`,
    ...getAuth(),
  });

  // @ts-ignore
  const enhancer = isDev && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({name: 'Doko'});
  const store = createStore(storeReducer, enhancer);
  badge(store.client, {messages: badgeMessages, styles: badgeStyles});
  if (isDev) {
    log(store.client);
  }
  store.client.start();

  initDarkMode();

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <DndContext>
          <App />
        </DndContext>
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
}

export async function initApp() {
  let buildTime: number = 4711; //dev
  if (process.env.NODE_ENV === 'production') {
    const response = await fetch('/version.json', {cache: "no-cache"});
    buildTime = (await response.json() as {buildTime: number}).buildTime;
  }
  localStorage.setItem('buildTime', buildTime.toString());
  setBuildTime(buildTime);
  initLogux();
}
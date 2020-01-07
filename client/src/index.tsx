import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'fomantic-ui-css/semantic.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
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
// @ts-ignore
// import IndexedStore from '@logux/client/indexed-store';
import {storeReducer} from 'src/store/Store';
import {getAuth} from './Auth';

const isDev = process.env.NODE_ENV === 'development';

const createStore = createLoguxCreator({
  subprotocol: '1.0.0',
  server: isDev
    ? window.location.protocol === 'https:'
      ? `wss://${window.location.hostname}/api`
      : `ws://${window.location.hostname}:3030`
    : 'wss://logux.example.com',
  // store: new IndexedStore(),
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

ReactDOM.render(
  <Provider store={store}><App/></Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://create-react-app.dev/docs/making-a-progressive-web-app/
serviceWorker.unregister();

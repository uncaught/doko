import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'fomantic-ui-css/semantic.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import {reducer} from './store/store';
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
import IndexedStore from '@logux/client/indexed-store';

const createStore = createLoguxCreator({
  subprotocol: '1.0.0',
  server: process.env.NODE_ENV === 'development'
    ? 'ws://192.168.42.211:3030'
    : 'wss://logux.example.com',
  store: new IndexedStore(),
  userId: localStorage.getItem('userId') || false,
  credentials: localStorage.getItem('userToken') || false,
});
const store = createStore(reducer);
badge(store.client, {messages: badgeMessages, styles: badgeStyles});
log(store.client);
store.client.start();

ReactDOM.render(
  <Provider store={store}><App/></Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

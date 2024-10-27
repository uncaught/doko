// @ts-ignore
import badge from '@logux/client/badge';
// @ts-ignore
import badgeStyles from '@logux/client/badge/default';
// @ts-ignore
import badgeMessages from '@logux/client/badge/en';
// @ts-ignore
import log from '@logux/client/log';
// @ts-ignore
import createLoguxCreator from '@logux/redux/create-logux-creator';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {getAuth} from './Auth';
import {initDarkMode} from './DarkMode';
import DndContext from './DndContext';
import {getLoguxPrefix, setBuildTime} from './LocalStorage';
import {storeReducer} from './store/Store';

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

  const divRoot = document.getElementById('root');
  if (divRoot) {
    const reactRoot = createRoot(divRoot);
    reactRoot.render(
      <StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <DndContext>
              <App />
            </DndContext>
          </BrowserRouter>
        </Provider>
      </StrictMode>,
    );
  }
}

export async function initApp() {
  let buildTime: number = 4711; //dev
  if (process.env.NODE_ENV === 'production') {
    const response = await fetch('/version.json', {cache: 'no-cache'});
    buildTime = ((await response.json()) as {buildTime: number}).buildTime;
  }
  localStorage.setItem('buildTime', buildTime.toString());
  setBuildTime(buildTime);
  initLogux();
}

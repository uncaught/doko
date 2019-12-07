import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'fomantic-ui-css/semantic.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import {firebaseContext, initFirebaseContext} from 'src/components/Firebase/Firebase';

ReactDOM.render(
  <firebaseContext.Provider value={initFirebaseContext()}>
    <App/>
  </firebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

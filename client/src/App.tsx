import React, {ReactElement} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import './App.css';
import Groups from './pages/groups';
import Page from './Page';

export default function App(): ReactElement | null {
  return <Router>
    <Switch>
      <Page path="/groups" displayName={'Meine Gruppen'}>
        <Groups/>
      </Page>
      <Page path="/" displayName={'Doppelkopf'}>
        Home
      </Page>
    </Switch>
  </Router>;
}

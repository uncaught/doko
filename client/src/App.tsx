import React, {ReactElement} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import './App.css';
import './DarkMode.css';
import Groups from './pages/groups';
import Page from './Page';
import useSubscription from '@logux/redux/use-subscription';
import {GroupsLoad} from '@doko/common';
import HandleInvitation from './pages/HandleInvitation';
import Simulation from './pages/Simulation';

export default function App(): ReactElement | null {
  useSubscription<GroupsLoad>(['groups/load']);

  return <Router>
    <Switch>
      <Page path="/invitation" displayName={'Einladung'}>
        <HandleInvitation/>
      </Page>
      <Page path="/simulation" displayName={'Simulation'}>
        <Simulation/>
      </Page>
      <Page path="/" displayName={'Doppelkopf'}>
        <Groups/>
      </Page>
    </Switch>
  </Router>;
}

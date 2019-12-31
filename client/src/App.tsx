import React, {ReactElement} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import './App.css';
import Groups from './pages/groups';
import Page from './Page';
import useSubscription from '@logux/redux/use-subscription';
import {GroupsLoad} from '@doko/common';

export default function App(): ReactElement | null {
  useSubscription<GroupsLoad>(['groups/load']);

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

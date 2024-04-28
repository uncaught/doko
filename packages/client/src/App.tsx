import {GroupsLoad} from '@doko/common';
import useSubscription from '@logux/redux/use-subscription';
import React, {ReactElement} from 'react';
import {Switch} from 'react-router-dom';
import './App.css';
import './DarkMode.scss';
import Page from './Page';
import Groups from './pages/groups';
import HandleInvitation from './pages/HandleInvitation';
import Simulation from './pages/Simulation';
import {useFollowLatestGame} from './store/Ui';

export default function App(): ReactElement | null {
  useSubscription<GroupsLoad>(['groups/load']);
  useFollowLatestGame();

  return <Switch>
    <Page path='/invitation' displayName={'Einladung'}>
      <HandleInvitation/>
    </Page>
    <Page path='/simulation' displayName={'Simulation'}>
      <Simulation/>
    </Page>
    <Page path='/' displayName={'Doppelkopf'}>
      <Groups/>
    </Page>
  </Switch>;
}

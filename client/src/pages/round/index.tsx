import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import Players from './Players';
import {useLoadRoundDetails} from '../../store/Rounds';
import Round from './Round';

export default function (): ReactElement {
  useLoadRoundDetails();
  const {url} = useRouteMatch();
  return <Switch>
    <Page path={`${url}/players`} displayName={'Mitspieler'}>
      <Players/>
    </Page>
    <Page path={`${url}`}>
      <Round/>
    </Page>
  </Switch>;
}

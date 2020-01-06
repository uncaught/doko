import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import Round from '../round';
import Rounds from './Rounds';

export default function RoundsIndex(): ReactElement {
  const {url} = useRouteMatch();
  return <Switch>
    <Page path={`${url}/round/:roundId`} displayName={'Runde'}>
      <Round/>
    </Page>
    <Page path={`${url}`}>
      <Rounds/>
    </Page>
  </Switch>;
}

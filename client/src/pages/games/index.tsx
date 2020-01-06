import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import Games from './Games';
import Game from '../game';

export default function GamesIndex(): ReactElement {
  const {url} = useRouteMatch();
  return <Switch>
    <Page path={`${url}/game/:gameId`} displayName={'Spiel'}>
      <Game/>
    </Page>
    <Page path={`${url}`}>
      <Games/>
    </Page>
  </Switch>;
}

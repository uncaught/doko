import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import Games from './Games';
import Game from '../game';
import RemoveGameMenuItem from '../game/RemoveGameMenuItem';
import ExtraSidebar from '../game/ExtraSidebar';

export default function GamesIndex(): ReactElement {
  const {url} = useRouteMatch();
  return <Switch>
    <Page path={`${url}/game/:gameId`} displayName={'Spiel'} menuItems={[RemoveGameMenuItem]}
          ExtraSidebar={ExtraSidebar}>
      <Game/>
    </Page>
    <Page path={`${url}`}>
      <Games/>
    </Page>
  </Switch>;
}

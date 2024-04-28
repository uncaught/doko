import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import Game from '../game';
import ExtraSidebar from '../game/ExtraSidebar';
import RemoveGameMenuItem from '../game/RemoveGameMenuItem';
import Games from './Games';

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

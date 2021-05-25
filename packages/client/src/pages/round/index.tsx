import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import SittingOrder from './SittingOrder';
import {useLoadRoundDetails, useRound} from '../../store/Rounds';
import Round from './Round';
import Games from '../games';
import RemoveRoundMenuItem from './RemoveRoundMenuItem';

export default function RoundIndex(): ReactElement | null {
  useLoadRoundDetails();
  const {url} = useRouteMatch();
  if (!useRound()) {
    return null;
  }
  return <Switch>
    <Page path={`${url}/players`} displayName={'Mitspieler'}>
      <SittingOrder/>
    </Page>
    <Page path={`${url}/games`} displayName={'Spiele'}>
      <Games/>
    </Page>
    <Page path={`${url}`} menuItems={[RemoveRoundMenuItem]}>
      <Round/>
    </Page>
  </Switch>;
}

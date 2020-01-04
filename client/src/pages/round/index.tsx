import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import SittingOrder from './SittingOrder';
import {useLoadRoundDetails} from '../../store/Rounds';
import Round from './Round';
import Games from './Games';

export default function (): ReactElement {
  useLoadRoundDetails();
  const {url} = useRouteMatch();
  return <Switch>
    <Page path={`${url}/players`} displayName={'Mitspieler'}>
      <SittingOrder/>
    </Page>
    <Page path={`${url}/games`} displayName={'Spiele'}>
      <Games/>
    </Page>
    <Page path={`${url}`}>
      <Round/>
    </Page>
  </Switch>;
}

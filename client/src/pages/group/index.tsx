import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Member from '../member/Member';
import Group from './Group';
import FullRoute from '../../FullRoute';
import Rounds from './Rounds';

export default function (): ReactElement {
  const match = useRouteMatch();
  return <div>
    <Switch>
      <FullRoute path={`${match.url}/rounds`}>
        <Rounds/>
      </FullRoute>
      <FullRoute path={`${match.url}/member/:groupMemberId`}>
        <Member/>
      </FullRoute>
      <FullRoute path={`${match.url}`}>
        <Group/>
      </FullRoute>
    </Switch>
  </div>;
}

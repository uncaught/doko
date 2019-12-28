import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Members from './Members';
import Member from './Member';
import Group from './Group';
import FullRoute from '../../FullRoute';

export default function (): ReactElement {
  const match = useRouteMatch();
  return <div>
    <Switch>
      <FullRoute path={`${match.url}/members`}>
        <Members/>
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

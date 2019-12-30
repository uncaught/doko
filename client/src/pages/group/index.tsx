import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Member from '../member/Member';
import Group from './Group';
import Page from '../../Page';
import Rounds from './Rounds';
import Members from './Members';
import {Divider} from 'semantic-ui-react';
import AddMember from './AddMember';

export default function (): ReactElement {
  const match = useRouteMatch();
  return <Switch>
    <Page path={`${match.url}/rounds`} displayName={'Runden'}>
      <Rounds/>
    </Page>
    <Page path={`${match.url}/member/:groupMemberId`} displayName={'Mitglied'}>
      <Member/>
    </Page>
    <Page path={`${match.url}/addMembers`} displayName={'Mitglieder'}>
      <Members/>
      <Divider section/>
      <AddMember/>
    </Page>
    <Page path={`${match.url}`}
          menuItems={[{icon: 'user plus', route: `${match.url}/addMembers`, title: 'Mitglieder hinzufügen'}]}>
      <Group/>
    </Page>
  </Switch>;
}

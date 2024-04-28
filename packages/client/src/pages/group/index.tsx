import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import {Divider} from 'semantic-ui-react';
import Page from '../../Page';
import {useLoadGroupMembers} from '../../store/GroupMembers';
import {useGroup} from '../../store/Groups';
import {useLoadRounds} from '../../store/Rounds';
import Member from '../member/Member';
import PotIndex from '../pot';
import Rounds from '../rounds';
import EnableIrregularMembersMenuItem from '../statistics/EnableIrregularMembersMenuItem';
import Statistics from '../statistics/Statistics';
import AddMember from './AddMember';
import Group from './Group';
import Members from './Members';
import Settings from './Settings';

export default function GroupIndex(): ReactElement | null {
  useLoadGroupMembers();
  useLoadRounds();
  const {url} = useRouteMatch();
  if (!useGroup()) {
    return null;
  }
  return <Switch>
    <Page path={`${url}/settings`} displayName={'Einstellungen'}>
      <Settings/>
    </Page>
    <Page path={`${url}/rounds`} displayName={'Runden'}>
      <Rounds/>
    </Page>
    <Page path={`${url}/member/:groupMemberId`} displayName={'Mitglied'}>
      <Member/>
    </Page>
    <Page path={`${url}/addMembers`} displayName={'Mitglieder'}>
      <Members/>
      <Divider section/>
      <AddMember/>
    </Page>
    <Page path={`${url}/statistics`} displayName={'Mitglieder'} menuItems={[EnableIrregularMembersMenuItem]}>
      <Statistics/>
    </Page>
    <Page path={`${url}/pot`} displayName={'Pott'}>
      <PotIndex/>
    </Page>
    <Page path={`${url}`} menuItems={[
      {icon: 'user plus', route: `${url}/addMembers`, title: 'Mitglieder hinzufügen'},
    ]}>
      <Group/>
    </Page>
  </Switch>;
}

import React, {ReactElement} from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Member from '../member/Member';
import Group from './Group';
import Page from '../../Page';
import Rounds from '../rounds';
import Members from './Members';
import {Divider} from 'semantic-ui-react';
import AddMember from './AddMember';
import {useLoadGroupMembers} from '../../store/GroupMembers';
import {useLoadRounds} from '../../store/Rounds';
import Settings from './Settings';
import {useGroup} from '../../store/Groups';
import Statistics from '../statistics/Statistics';
import EnableIrregularMembersMenuItem from '../statistics/EnableIrregularMembersMenuItem';
import {PageMenuItemConfig} from '../../PageMenu';

export default function GroupIndex(): ReactElement | null {
  useLoadGroupMembers();
  useLoadRounds();
  const {url} = useRouteMatch();
  if (!useGroup()) {
    return null;
  }
  const stats: PageMenuItemConfig = {
    icon: 'balance scale',
    route: `${url}/statistics`,
    title: 'Statistiken',
    passDown: true,
  };
  return <Switch>
    <Page path={`${url}/settings`} displayName={'Einstellungen'} menuItems={[stats]}>
      <Settings/>
    </Page>
    <Page path={`${url}/rounds`} displayName={'Runden'} menuItems={[stats]}>
      <Rounds/>
    </Page>
    <Page path={`${url}/member/:groupMemberId`} displayName={'Mitglied'} menuItems={[stats]}>
      <Member/>
    </Page>
    <Page path={`${url}/addMembers`} displayName={'Mitglieder'} menuItems={[stats]}>
      <Members/>
      <Divider section/>
      <AddMember/>
    </Page>
    <Page path={`${url}/statistics`} displayName={'Mitglieder'} menuItems={[EnableIrregularMembersMenuItem]}>
      <Statistics/>
    </Page>
    <Page path={`${url}`} menuItems={[
      {icon: 'user plus', route: `${url}/addMembers`, title: 'Mitglieder hinzufügen'},
      stats,
    ]}>
      <Group/>
    </Page>
  </Switch>;
}

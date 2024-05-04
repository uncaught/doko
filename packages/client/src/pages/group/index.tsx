import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import Page from '../../Page';
import {useLoadGroupMembers} from '../../store/GroupMembers';
import {useGroup} from '../../store/Groups';
import {useLoadRounds} from '../../store/Rounds';
import GroupName from './GroupName';
import Members from './Members';
import Pot from './Pot';
import RoundsInfo from './RoundsInfo';

export default function Group(): ReactElement | null {
  useLoadGroupMembers();
  useLoadRounds();
  if (!useGroup()) {
    return null;
  }
  return <Page displayName={'Gruppe'}
               menuItems={[{icon: 'user plus', route: `/addMembers`, title: 'Mitglieder hinzufügen'}]}>
    <div>
      <GroupName/>
      <Divider/>
      <RoundsInfo/>
      <Divider/>
      <Pot/>
      <Members/>
    </div>
  </Page>;
}

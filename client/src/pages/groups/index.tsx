import React, {ReactElement} from 'react';
import AddGroup from './AddGroup';
import {Divider} from 'semantic-ui-react';
import MyGroups from './MyGroups';
import {Switch} from 'react-router-dom';
import Page from '../../Page';
import Group from '../group';
import CashInvitation from './CashInvitation';

export default function GroupsIndex(): ReactElement {
  return <Switch>
    <Page path={`/group/:groupId`} displayName={'Gruppe'}>
      <Group/>
    </Page>
    <Page path={'/'}>
      <MyGroups/>
      <Divider section/>
      <AddGroup/>
      <Divider section/>
      <CashInvitation/>
    </Page>
  </Switch>;
}

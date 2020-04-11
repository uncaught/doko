import React, {ReactElement} from 'react';
import AddGroup from './AddGroup';
import {Divider, Icon, Menu} from 'semantic-ui-react';
import MyGroups from './MyGroups';
import {Switch} from 'react-router-dom';
import Page from '../../Page';
import Group from '../group';
import CashInvitation from './CashInvitation';

function ForceReloadMenuItem(): ReactElement {
  return <Menu.Item onClick={async () => window.location.reload()}>
    <Icon name='refresh'/>
    Seite neu laden
  </Menu.Item>;
}

export default function GroupsIndex(): ReactElement {
  return <Switch>
    <Page path={`/group/:groupId`} displayName={'Gruppe'}>
      <Group/>
    </Page>
    <Page path={'/'} menuItems={[ForceReloadMenuItem]}>
      <MyGroups/>
      <Divider section/>
      <AddGroup/>
      <Divider section/>
      <CashInvitation/>
    </Page>
  </Switch>;
}

import React, {ReactElement} from 'react';
import AddGroup from './AddGroup';
import ScanInvitation from './ScanInvitation';
import {Divider} from 'semantic-ui-react';
import MyGroups from './MyGroups';
import {Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../Page';
import Group from '../group';

export default function GroupsIndex(): ReactElement {
  const {url} = useRouteMatch();
  return <Switch>
    <Page path={`${url}/group/:groupId`} displayName={'Gruppe'}>
      <Group/>
    </Page>
    <Page path={`${url}`}>
      <MyGroups/>
      <Divider section/>
      <AddGroup/>
      <Divider section/>
      <ScanInvitation/>
    </Page>
  </Switch>;
}

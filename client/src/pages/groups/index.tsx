import React, {ReactElement} from 'react';
import AddGroup from './AddGroup';
import {Checkbox, Divider, Icon, Menu} from 'semantic-ui-react';
import MyGroups from './MyGroups';
import {Switch} from 'react-router-dom';
import Page from '../../Page';
import Group from '../group';
import CashInvitation from './CashInvitation';
import {forceReload} from '../../forceReload';
import {useToggleDarkMode} from '../../DarkMode';

function ForceReloadMenuItem(): ReactElement {
  return <Menu.Item onClick={forceReload}>
    <Icon name='refresh' />
    Seite neu laden
  </Menu.Item>;
}

function ToggleDarkMode(): ReactElement {
  const {isDark, toggle} = useToggleDarkMode();
  return <Menu.Item onClick={toggle}>
    <Icon name={'moon'} />
    <Checkbox label={'Dark Mode'} checked={isDark} />
  </Menu.Item>;
}

const menuItems = [
  ToggleDarkMode,
  ForceReloadMenuItem,
];

export default function GroupsIndex(): ReactElement {
  return <Switch>
    <Page path={`/group/:groupId`} displayName={'Gruppe'}>
      <Group />
    </Page>
    <Page path={'/'} menuItems={menuItems}>
      <MyGroups />
      <Divider section />
      <AddGroup />
      <Divider section />
      <CashInvitation />
    </Page>
  </Switch>;
}

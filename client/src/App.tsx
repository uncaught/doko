import React, {ReactElement, useCallback, useState} from 'react';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import {Menu, Sidebar} from 'semantic-ui-react';
import './App.css';
import AppHeader from './AppHeader';
import AppMenu from './AppMenu';
import Group from './pages/group';
import Groups from './pages/groups';
import FullRoute from './FullRoute';

export default function App(): ReactElement | null {
  const [visible, setVisible] = useState(false);
  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);
  return <Router>
    <Sidebar.Pushable as={'div'}>
      <Sidebar
        as={Menu}
        animation='overlay'
        icon='labeled'
        inverted
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width='thin'
      >
        <AppMenu closeMenu={closeMenu}/>
      </Sidebar>

      <Sidebar.Pusher dimmed={visible}>
        <div className="app">
          <AppHeader openMenu={openMenu}/>
          <div className="app-pages">
            <Switch>
              <FullRoute path="/group/:groupId">
                <Group/>
              </FullRoute>
              <FullRoute path="/groups">
                <Groups/>
              </FullRoute>
            </Switch>
          </div>
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  </Router>;
}

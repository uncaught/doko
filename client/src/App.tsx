import React, {ReactElement, useCallback, useState} from 'react';
import './App.css';
import MyGroups from 'src/pages/groups/MyGroups';
import {Menu, Sidebar} from 'semantic-ui-react';
import AppHeader from './AppHeader';
import AppMenu from './AppMenu';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

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
              <Route path="/groups">
                <MyGroups/>
              </Route>
              <Route path="/users">
                users
              </Route>
              <Route path="/">
                home
              </Route>
            </Switch>
          </div>
        </div>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  </Router>;
}

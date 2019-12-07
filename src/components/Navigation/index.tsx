import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {Dropdown, Icon} from 'semantic-ui-react';
import {firebaseContext, useCurrentUser} from 'src/components/Firebase/Firebase';

export default function Navigation() {
  const {auth} = useContext(firebaseContext);
  const currentUser = useCurrentUser();
  const isLoggedIn = !!currentUser;
  return <div>
    <Dropdown icon={isLoggedIn ? 'user' : 'user outline'}>
      <Dropdown.Menu>
        {!isLoggedIn && <>
          <Dropdown.Item>
            <Icon name={'sign in'}/>
            <Link to={ROUTES.SIGN_IN}>Anmelden</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name={'user plus'}/>
            <Link to={ROUTES.SIGN_UP}>Registrieren</Link>
          </Dropdown.Item>
        </>}
        {isLoggedIn && <Dropdown.Item onClick={() => auth.signOut()}>
          <Icon name={'sign out'}/>
          <span>Abmelden</span>
        </Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Anmelden</Link>
      </li>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
    </ul>
  </div>;
}

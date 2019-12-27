import React, {ReactElement, useCallback} from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import {asLink} from './AsLink';

export default function AppMenu({closeMenu}: { closeMenu: () => void }): ReactElement | null {
  const Item = useCallback(({children, route}: { children: React.ReactNode; route: string }) => {
    return <Menu.Item as={asLink(route, {className: 'item', onClick: closeMenu})}>{children}</Menu.Item>;
  }, [closeMenu]);

  return <>
    <Item route={'/'}>
      <Icon name='home'/>
      home
    </Item>
    <Item route={'/groups'}>
      <Icon name='group'/>
      Meine Gruppen
    </Item>
  </>;
}

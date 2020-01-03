import React, {ReactElement, useCallback} from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import {asLink} from './AsLink';
import {SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';

export interface PageMenuItemConfig {
  route: string;
  icon: SemanticICONS;
  title: string;
}

export default function PageMenu({closeMenu, menuItems}: { closeMenu: () => void; menuItems?: PageMenuItemConfig[] }): ReactElement | null {
  const Item = useCallback(({children, route}: { children: React.ReactNode; route: string }) => {
    return <Menu.Item as={asLink(route, {onClick: closeMenu})}>{children}</Menu.Item>;
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
    {!!menuItems && menuItems.map(({route, icon, title}, idx) => <Item key={idx} route={route}>
      <Icon name={icon}/>{title}</Item>)}
  </>;
}

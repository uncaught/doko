import React, {ReactElement, useCallback} from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import {asLink} from './AsLink';
import {SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';

interface PageMenuItemConfig {
  route: string;
  icon: SemanticICONS;
  title: string;
}

type PageMenuItemComp = React.FC<{ closeMenu: () => void }>;

export type PageMenuItems = Array<PageMenuItemConfig | PageMenuItemComp>;

function isConfig(item: PageMenuItemConfig | PageMenuItemComp): item is PageMenuItemConfig {
  return item.hasOwnProperty('route');
}

export default function PageMenu({closeMenu, menuItems}: { closeMenu: () => void; menuItems?: PageMenuItems }): ReactElement | null {
  const Item = useCallback(({children, route}: { children: React.ReactNode; route: string }) => {
    return <Menu.Item as={asLink(route, {onClick: closeMenu})}>{children}</Menu.Item>;
  }, [closeMenu]);
  return <>
    <Item route={'/'}>
      <Icon name='home'/>
      Home
    </Item>
    <Item route={'/groups'}>
      <Icon name='group'/>
      Meine Gruppen
    </Item>
    {!!menuItems && menuItems.map((MenuItem, idx) => {
      if (isConfig(MenuItem)) {
        return <Item key={idx} route={MenuItem.route}>
          <Icon name={MenuItem.icon}/>{MenuItem.title}</Item>;
      }
      return <MenuItem key={idx} closeMenu={closeMenu}/>;
    })}
  </>;
}

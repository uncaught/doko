import React, {ReactElement, useCallback} from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import {asLink} from './AsLink';
import {SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';
import {usePageContext} from './Page';

export interface PageMenuItemConfig {
  route: string;
  icon: SemanticICONS;
  title: string;
  passDown?: boolean;
}

export type PageMenuItemComp = React.FC<{ closeMenu: () => void }> & { passDown?: boolean };

export type PageMenuItems = Array<PageMenuItemConfig | PageMenuItemComp>;

function isConfig(item: PageMenuItemConfig | PageMenuItemComp): item is PageMenuItemConfig {
  return item.hasOwnProperty('route');
}

export default function PageMenu({closeMenu}: { closeMenu: () => void }): ReactElement | null {
  const {menuItems} = usePageContext();
  const Item = useCallback(({children, route}: { children: React.ReactNode; route: string }) => {
    return <Menu.Item as={asLink(route, {onClick: closeMenu})}>{children}</Menu.Item>;
  }, [closeMenu]);
  return <>
    <Item route={'/'}>
      <Icon name='group'/>
      Meine Gruppen
    </Item>
    <Item route={'/simulation'}>
      <Icon name='gamepad'/>
      Simulation
    </Item>
    {menuItems.map((MenuItem, idx) => {
      if (isConfig(MenuItem)) {
        return <Item key={idx} route={MenuItem.route}>
          <Icon name={MenuItem.icon}/>{MenuItem.title}</Item>;
      }
      return <MenuItem key={idx} closeMenu={closeMenu}/>;
    })}
  </>;
}

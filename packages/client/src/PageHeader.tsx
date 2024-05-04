import React, {ReactElement} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Icon} from 'semantic-ui-react';
import SuitsLogo from './icons/SuitsLogo';

export default function PageHeader({displayName, onNameClick, openMenu}: {
  displayName: string;
  onNameClick?: () => void;
  openMenu: () => void
}): ReactElement {
  const {pathname} = useLocation();
  return <header className='appPageHeader'>
    {pathname.length === 0 && <SuitsLogo/>}
    {pathname.length > 0 && <Link className='appPageHeader-link' to={'..'}><Icon name={'arrow left'}/></Link>}
    <div className='appPageHeader-name' onClick={onNameClick}>{displayName}</div>
    <Icon name={'bars'} onClick={openMenu}/>
  </header>;
}

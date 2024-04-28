import React, {ReactElement} from 'react';
import {Link} from 'react-router-dom';
import {Icon} from 'semantic-ui-react';
import SuitsLogo from './icons/SuitsLogo';
import {usePageContext} from './Page';

export default function PageHeader({onNameClick, openMenu}: {
  onNameClick?: () => void;
  openMenu: () => void
}): ReactElement {
  const {displayName, parents} = usePageContext();
  return <header className='appPageHeader'>
    {parents.length === 0 && <SuitsLogo/>}
    {parents.length > 0 && <Link className='appPageHeader-link' to={parents[0].url}><Icon name={'arrow left'}/></Link>}
    <div className='appPageHeader-name' onClick={onNameClick}>{displayName}</div>
    <Icon name={'bars'} onClick={openMenu}/>
  </header>;
}

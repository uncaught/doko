import React, {ReactElement} from 'react';
import SuitsLogo from './icons/SuitsLogo';
import {Icon} from 'semantic-ui-react';
import {useFullParams} from './Page';
import {Link} from 'react-router-dom';

export default function PageHeader({openMenu}: { openMenu: () => void }): ReactElement {
  const {displayName, parents} = useFullParams();
  return <header className="appPageHeader">
    {parents.length === 0 && <SuitsLogo/>}
    {parents.length > 0 && <Link className="appPageHeader-link" to={parents[0].url}><Icon name={'arrow left'}/></Link>}
    <div>{displayName}</div>
    <Icon name={'bars'} onClick={openMenu}/>
  </header>;
}

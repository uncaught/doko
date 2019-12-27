import React, {ReactElement} from 'react';
import SuitsLogo from './icons/SuitsLogo';
import {Icon} from 'semantic-ui-react';

export default function AppHeader({openMenu}: { openMenu: () => void }): ReactElement {
  return <header className="app-header">
    <Icon name={'bars'} onClick={openMenu}/>
    <div>Doppelkopf</div>
    <SuitsLogo/>
  </header>;
}

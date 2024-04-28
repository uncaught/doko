import React, {ReactElement} from 'react';
import {Menu, Sidebar} from 'semantic-ui-react';
import Players from '../round/Players';

export default function ExtraSidebar({visible, close}: {visible: boolean; close: () => void}): ReactElement {
  return <Sidebar
    as={Menu}
    animation='overlay'
    icon='labeled'
    inverted
    onHide={close}
    vertical
    visible={visible}
    direction='left'
  >
    <div className={'GameExtraSidebarWrapper'}>
      <Players/>
    </div>
  </Sidebar>;
}

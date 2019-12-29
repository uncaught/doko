import React, {ReactElement} from 'react';
import AddGroup from './AddGroup';
import ScanInvitation from './ScanInvitation';
import {Divider} from 'semantic-ui-react';
import MyGroups from './MyGroups';

export default function (): ReactElement {
  return <div>
    <MyGroups/>
    <Divider section/>
    <AddGroup/>
    <Divider section/>
    <ScanInvitation/>
  </div>;
}

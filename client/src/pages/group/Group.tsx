import React, {ReactElement} from 'react';
import Members from './Members';
import {Divider} from 'semantic-ui-react';
import Rounds from './Rounds';
import GroupName from './GroupName';

export default function Group(): ReactElement {
  return <div>
    <GroupName/>

    <Divider section/>

    <Rounds limit={3}/>

    <Divider section/>

    <Members/>
  </div>;
}

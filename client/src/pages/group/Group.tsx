import React, {ReactElement} from 'react';
import Members from './Members';
import {Divider} from 'semantic-ui-react';
import RoundsInfo from './RoundsInfo';
import GroupName from './GroupName';

export default function Group(): ReactElement {
  return <div>
    <GroupName/>
    <Divider />
    <RoundsInfo/>
    <Divider />
    <Members/>
  </div>;
}

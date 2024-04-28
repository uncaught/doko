import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import GroupName from './GroupName';
import Members from './Members';
import Pot from './Pot';
import RoundsInfo from './RoundsInfo';

export default function Group(): ReactElement {
  return <div>
    <GroupName/>
    <Divider/>
    <RoundsInfo/>
    <Divider/>
    <Pot/>
    <Members/>
  </div>;
}

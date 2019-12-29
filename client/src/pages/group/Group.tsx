import React, {ReactElement} from 'react';
import {useGroup, usePatchGroup} from '../../Store/Groups';
import EditableName from '../../components/EditableName';
import Members from './Members';
import {Divider} from 'semantic-ui-react';
import Rounds from './Rounds';

export default function Group(): ReactElement {
  return <div>
    <EditableName icon={'group'} useGet={useGroup} usePatch={usePatchGroup}/>

    <Divider section/>

    <Rounds limit={3}/>

    <Divider section/>

    <Members/>
  </div>;
}

import React, {ReactElement} from 'react';
import {useGroup, usePatchGroup} from '../../Store/Groups';
import EditableName from '../../components/EditableName';

export default function Group(): ReactElement {
  return <div>
    <EditableName useGet={useGroup} usePatch={usePatchGroup}/>
  </div>;
}

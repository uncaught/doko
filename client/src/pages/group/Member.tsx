import React, {ReactElement} from 'react';
import EditableName from '../../components/EditableName';
import {useGroupMember, usePatchGroupMember} from '../../Store/GroupMembers';

export default function Member(): ReactElement {
  return <div>
    <EditableName useGet={useGroupMember} usePatch={usePatchGroupMember}/>
  </div>;
}

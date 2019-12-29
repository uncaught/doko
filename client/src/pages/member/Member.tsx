import React, {ReactElement} from 'react';
import EditableName from '../../components/EditableName';
import {useGroupMember, usePatchGroupMember} from '../../Store/GroupMembers';
import {Divider} from 'semantic-ui-react';
import InviteDevice from './InviteDevice';

export default function Member(): ReactElement {
  return <div>
    <EditableName icon={'user'} useGet={useGroupMember} usePatch={usePatchGroupMember}/>

    <Divider section/>

    <InviteDevice/>
  </div>;
}

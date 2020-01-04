import React, {ReactElement} from 'react';
import EditableName from '../../components/EditableName';
import {useGroupMember, usePatchGroupMember} from '../../store/GroupMembers';
import {Divider} from 'semantic-ui-react';
import InviteDevice from './InviteDevice';
import Stats from './Stats';
import Settings from './Settings';

export default function Member(): ReactElement {
  return <div>
    <EditableName icon={'user'} useGet={useGroupMember} usePatch={usePatchGroupMember}/>
    <Stats/>
    <Divider section/>
    <Settings/>
    <Divider section/>
    <InviteDevice/>
  </div>;
}

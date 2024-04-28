import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import EditableName from '../../components/EditableName';
import {useGroupMember, usePatchGroupMember} from '../../store/GroupMembers';
import InviteDevice from './InviteDevice';
import Settings from './Settings';
import Stats from './Stats';

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

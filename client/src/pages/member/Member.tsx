import React, {ReactElement} from 'react';
import EditableName from '../../components/EditableName';
import {useGroupMember, usePatchGroupMember} from '../../Store/GroupMembers';
import {Divider, Icon, Label} from 'semantic-ui-react';
import InviteDevice from './InviteDevice';
import {useGroup} from '../../Store/Groups';

export default function Member(): ReactElement {
  const {roundsCount: groupRoundsCount = 1} = useGroup() || {};
  const {pointBalance = 0, roundsCount = 0, euroBalance = 0, isYou} = useGroupMember() || {};

  return <div>
    <EditableName icon={'user'} useGet={useGroupMember} usePatch={usePatchGroupMember}/>

    <section className="u-flex-columnx">

      <div className="memberDetail">
        <Label color={pointBalance >= 0 ? 'green' : 'red'}>
          Punktebilanz
          <Label.Detail>
            {pointBalance} <Icon name='sort'/>
          </Label.Detail>
        </Label>
      </div>

      <div className="memberDetail">
        <Label color={'orange'}>
          Teilnahmen
          <Label.Detail>
            {roundsCount} / {Math.ceil(roundsCount / groupRoundsCount * 100)}% <Icon name='time'/>
          </Label.Detail>
        </Label>
      </div>

      {!!euroBalance && <div className="memberDetail">
        <Label color={'blue'}>
          Euro-Bilanz
          <Label.Detail>
            {euroBalance} <Icon name='euro sign'/>
          </Label.Detail>
        </Label>
      </div>}

      {!!isYou && <div className="memberDetail">
        <Label color={'teal'}>
          Verknüpft mit diesem Gerät <Icon name='linkify'/>
        </Label>
      </div>}

    </section>

    <Divider section/>

    <InviteDevice/>
  </div>;
}

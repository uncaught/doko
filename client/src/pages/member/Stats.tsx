import React, {ReactElement} from 'react';
import {useGroupMember} from '../../Store/GroupMembers';
import {Icon, Label} from 'semantic-ui-react';
import {useGroup} from '../../Store/Groups';

export default function Stats(): ReactElement {
  const {roundsCount: groupRoundsCount = 0} = useGroup() || {};
  const {pointBalance = 0, roundsCount = 0, euroBalance = 0, isYou} = useGroupMember() || {};

  return <section className="">

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
          {roundsCount} / {groupRoundsCount} ({groupRoundsCount
          ? Math.ceil(roundsCount / groupRoundsCount * 100)
          : 0}%) <Icon name='time'/>
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

  </section>;
}

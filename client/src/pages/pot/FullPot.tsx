import React, {ReactElement, useMemo} from 'react';
import {useSortedGroupMembers} from '../../store/GroupMembers';
import {Icon, Label} from 'semantic-ui-react';

export default function FullPot({as}: { as?: any }): ReactElement {
  const groupMembers = useSortedGroupMembers();
  const fullPot = useMemo(() => groupMembers.reduce((acc, {euroBalance}) => acc + (euroBalance || 0), 0),
    [groupMembers]);
  return <section>
    <div className="memberDetail">
      <Label as={as} color={'purple'}>
        Gesamter Pott
        <Label.Detail>
          {fullPot.toFixed(2)} <Icon name={'euro'}/>
        </Label.Detail>
      </Label>
    </div>
  </section>;
}

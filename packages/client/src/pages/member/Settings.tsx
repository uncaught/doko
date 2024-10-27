import React, {ReactElement} from 'react';
import {Checkbox} from 'semantic-ui-react';
import {useGroupMember, usePatchGroupMember} from '../../store/GroupMembers';

export default function Settings(): ReactElement {
  const patch = usePatchGroupMember();
  const {isRegular} = useGroupMember() || {};

  return (
    <section className=''>
      <Checkbox
        label='Ist reguläres Mitglied / kein Gast'
        onChange={(e, {checked}) => patch({isRegular: !!checked})}
        checked={isRegular}
      />
    </section>
  );
}

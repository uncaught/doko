import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import Page from '../../Page';
import AddMember from './AddMember';
import Members from './Members';

export default function AddMembers(): ReactElement {
  return (
    <Page displayName={'Mitglieder'}>
      <Members />
      <Divider section />
      <AddMember />
    </Page>
  );
}

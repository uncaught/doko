import React, {ReactElement} from 'react';
import {useSortedGroups} from '../../Store/Groups';
import AddGroup from './AddGroup';
import ScanInvitation from './ScanInvitation';
import './MyGroups.css';
import {Divider, Header, List} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import dayjs from 'dayjs';

export default function MyGroups(): ReactElement {
  const groups = useSortedGroups();

  return <div>
    <Header>Deine Gruppen</Header>

    {groups.length > 0 && <div className={'myGroups-groups'}>
      <List divided relaxed>
        {groups.map(({id, name, lastGameUnix}) => <List.Item key={id}>
          <List.Icon name='group' verticalAlign='middle'/>
          <List.Content>
            <List.Header as={asLink(`/group/${id}`)}>{name}</List.Header>
            <List.Description>
              {!lastGameUnix && `Noch kein Spiel aufgezeichnet`}
              {!!lastGameUnix && `Letztes Spiel am ${dayjs.unix(lastGameUnix).format('DD.MM.YYYY')}`}
            </List.Description>
          </List.Content>
        </List.Item>)}
      </List>
    </div>}

    {groups.length === 0 && <div className={'myGroups-noGroups'}>
      <p>Du hast noch keine Gruppen!</p>
      <p>Lege eine neue Gruppe an oder lass dich von einem Mitspieler zu einer Gruppe einladen.</p>
    </div>}

    <Divider section/>

    <AddGroup/>

    <Divider section/>

    <ScanInvitation/>
  </div>;
}

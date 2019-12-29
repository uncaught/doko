import React, {ReactElement} from 'react';
import {useSortedGroups} from '../../Store/Groups';
import {Header, List} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import dayjs from 'dayjs';

export default function MyGroups(): ReactElement {
  const groups = useSortedGroups();
  return <section>
    <Header as='h4'>Deine Gruppen</Header>

    {groups.length > 0 && <div className="myGroups-groups">
      <List divided relaxed>
        {groups.map(({id, name, lastGameUnix}) => <List.Item key={id}>
          <List.Icon name='group' verticalAlign='middle'/>
          <List.Content>
            <List.Header as={asLink(`/group/${id}`, {className: 'header'})}>{name}</List.Header>
            <List.Description>
              {!lastGameUnix && `Noch kein Spiel aufgezeichnet`}
              {!!lastGameUnix && `Letztes Spiel am ${dayjs.unix(lastGameUnix).format('DD.MM.YYYY')}`}
            </List.Description>
          </List.Content>
        </List.Item>)}
      </List>
    </div>}

    {groups.length === 0 && <div className="myGroups-noGroups">
      <p>Du hast noch keine Gruppen!</p>
      <p>Lege eine neue Gruppe an oder lass dich von einem Mitspieler zu einer Gruppe einladen.</p>
    </div>}
  </section>;
}
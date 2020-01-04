import React, {ReactElement} from 'react';
import {useSortedGroups} from '../../store/Groups';
import {Header, List} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import dayjs from 'dayjs';

export default function MyGroups(): ReactElement {
  const groups = useSortedGroups();
  return <section>
    <Header as='h4'>Meine Gruppen</Header>

    {groups.length > 0 && <List divided relaxed>
      {groups.map(({id, name, lastRoundUnix}) => <List.Item key={id}>
        <List.Icon name='group' verticalAlign='middle'/>
        <List.Content>
          <List.Header as={asLink(`/groups/group/${id}`)}>{name}</List.Header>
          <List.Description className="u-font-smaller">
            {!lastRoundUnix && `Noch keine Runde aufgezeichnet`}
            {!!lastRoundUnix && `Letzte Runde am ${dayjs.unix(lastRoundUnix).format('DD.MM.YYYY')}`}
          </List.Description>
        </List.Content>
      </List.Item>)}
    </List>}

    {groups.length === 0 && <div className="myGroups-noGroups">
      <p>Du hast noch keine Gruppen!</p>
      <p>Lege eine neue Gruppe an oder lass dich von einem Mitspieler zu einer Gruppe einladen.</p>
    </div>}
  </section>;
}

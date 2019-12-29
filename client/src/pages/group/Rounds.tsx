import React, {ReactElement} from 'react';
import {Header, Label, List} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useFullParams} from '../../FullRoute';
import {useSortedRounds} from '../../Store/Rounds';
import dayjs from 'dayjs';
import {Link} from 'react-router-dom';

export default function Rounds({limit}: { limit?: number }): ReactElement {
  const {groupId} = useFullParams<{ groupId: string }>();
  let rounds = useSortedRounds();

  if (limit) {
    rounds = rounds.slice(0, limit);
  }

  return <section>
    <Header as='h4'>Runden</Header>

    {rounds.length > 0 && <div className="">
      <List divided relaxed>
        {rounds.map(({id, date}) =>
          <List.Item key={id}>
            <List.Icon name='paw' verticalAlign='middle'/>
            <List.Content>
              <List.Header as={asLink(`/group/${groupId}/round/${id}`, {className: 'header'})}>
                {dayjs.unix(date).format('DD.MM.YYYY')}
              </List.Header>
              <List.Description>
                <Label color={'green'}>
                  Gewinner
                  <Label.Detail>XXX</Label.Detail>
                </Label>
              </List.Description>
            </List.Content>
          </List.Item>)}
      </List>
    </div>}

    {!!limit && <Link to={`/group/${groupId}/rounds`}>alle Runden</Link>}

  </section>;
}

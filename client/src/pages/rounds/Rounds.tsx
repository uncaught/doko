import React, {ReactElement} from 'react';
import {Header, Label, List} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useSortedRounds} from '../../store/Rounds';
import dayjs from 'dayjs';
import {useRouteMatch} from 'react-router-dom';

export default function Rounds(): ReactElement {
  let rounds = useSortedRounds();
  const {url} = useRouteMatch();

  return <section>
    <Header as='h4'>Runden</Header>

    {rounds.length > 0 && <div className="">
      <List divided relaxed>
        {rounds.map(({id, startDate}) =>
          <List.Item key={id}>
            <List.Icon name='bullseye' verticalAlign='middle'/>
            <List.Content>
              <List.Header as={asLink(`${url}/round/${id}`)}>
                {dayjs.unix(startDate).format('DD.MM.YYYY')}
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

  </section>;
}

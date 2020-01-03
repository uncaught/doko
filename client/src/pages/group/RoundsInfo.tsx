import React, {ReactElement} from 'react';
import {Header, Icon, Label} from 'semantic-ui-react';
import {useAddRound, useSortedRounds} from '../../Store/Rounds';
import dayjs from 'dayjs';
import {asLink} from '../../AsLink';
import {useRouteMatch} from 'react-router-dom';

export default function RoundsInfo(): ReactElement {
  const {url} = useRouteMatch();
  const rounds = useSortedRounds();
  const addRound = useAddRound();
  const lastRound = rounds[0];

  return <section>
    <Header as='h4'>Runden</Header>

    <div className="memberDetail">
      <Label as={asLink(`${url}/rounds`)} color={'orange'}>
        Alle Runden
        <Label.Detail>
          {rounds.length} <Icon name={'bullseye'}/>
        </Label.Detail>
      </Label>
    </div>

    {!!lastRound && <div className="memberDetail">
      <Label as={asLink(`${url}/rounds/round/${lastRound.id}`)} color={'blue'}>
        {lastRound.endDate ? 'Letzte' : 'Aktuelle'} Runde
        <Label.Detail>
          {dayjs.unix(lastRound.startDate).format('DD.MM.YYYY HH:mm')} <Icon name={'clock'}/>
        </Label.Detail>
      </Label>
    </div>}

    {(!lastRound || lastRound.endDate !== null) && <div className="memberDetail">
      <Label color={'green'} onClick={addRound}>
        Neue Runde
        <Label.Detail>
          <Icon name={'plus'}/>
        </Label.Detail>
      </Label>
    </div>}
  </section>;
}

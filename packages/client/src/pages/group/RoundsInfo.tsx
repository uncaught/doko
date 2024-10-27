import dayjs from 'dayjs';
import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useGroup} from '../../store/Groups';
import {useAddRound} from '../../store/Round/AddRound';
import {useSortedRounds} from '../../store/Rounds';

export default function RoundsInfo(): ReactElement {
  const {isGroupLocked} = useGroup()!.settings;
  const rounds = useSortedRounds();
  const addRound = useAddRound();
  const lastRound = rounds[0];

  return (
    <section>
      <div className='memberDetail'>
        <Label as={asLink(`rounds`)} color={'orange'}>
          Alle Runden
          <Label.Detail>
            {rounds.length} <Icon name={'bullseye'} />
          </Label.Detail>
        </Label>
      </div>

      {!!lastRound && (
        <div className='memberDetail'>
          <Label as={asLink(`rounds/round/${lastRound.id}`)} color={'blue'}>
            {lastRound.endDate ? 'Letzte' : 'Aktuelle'} Runde
            <Label.Detail>
              {dayjs.unix(lastRound.startDate).format('DD.MM.YYYY HH:mm')} <Icon name={'clock'} />
            </Label.Detail>
          </Label>
        </div>
      )}

      {!isGroupLocked && (!lastRound || lastRound.endDate !== null) && (
        <div className='memberDetail'>
          <Label color={'green'} onClick={addRound}>
            Neue Runde
            <Label.Detail>
              <Icon name={'plus'} />
            </Label.Detail>
          </Label>
        </div>
      )}
    </section>
  );
}

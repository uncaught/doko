import classNames from 'classnames';
import React, {Fragment, ReactElement} from 'react';
import {Header, Icon, Message} from 'semantic-ui-react';
import {useSortedGroupMembers} from '../../store/GroupMembers';
import {useGroup} from '../../store/Groups';

export default function SplitPotAttendance(): ReactElement {
  const {completedRoundsCount} = useGroup()!;
  const groupMembers = useSortedGroupMembers();
  let fullPot = 0;
  let attendances = 0;
  groupMembers.forEach(({euroBalance, roundsCount}) => {
    fullPot += euroBalance || 0;
    attendances += roundsCount || 0;
  });

  const mapped = groupMembers.map(({id, name, euroBalance, roundsCount}) => {
    const euros = euroBalance || 0;
    const attendance = roundsCount / attendances;
    const partial = fullPot * attendance;
    const balance = partial - euros;
    const row = (
      <Fragment key={id}>
        <div className={'name'}>{name}</div>
        <div className={'value'}>{euros.toFixed(2)} €</div>
        <div className={'value'}>
          {roundsCount} / {partial.toFixed(2)} €
        </div>
        <div className={classNames('value', {pos: balance >= 0, neg: balance < 0})}>{balance.toFixed(2)} €</div>
      </Fragment>
    );
    return {id, row, balance};
  });
  mapped.sort((a, b) => b.balance - a.balance);

  return (
    <section>
      <Header>#1 Split-Pott nach Teilnahmen</Header>
      <Message>
        <Message.Content>
          <p>Jeder Spieler hat durch seine Teilnahmen zum Pott beigetragen.</p>
          <p>Der Pott wird anteilig angerechnet.</p>
          <p>
            Es gibt insgesamt {completedRoundsCount} beendete Runden, mit {attendances} Teilnahmen.
          </p>
        </Message.Content>
      </Message>

      <div className={'potGrid splitPotAttendance'}>
        <div className={'name'} />
        <div className={'value'}>Beitrag</div>
        <div className={'value'}>Anteil</div>
        <div className={'value'}>
          <Icon name={'balance scale'} />
        </div>
        {mapped.map(({row}) => row)}
      </div>
    </section>
  );
}

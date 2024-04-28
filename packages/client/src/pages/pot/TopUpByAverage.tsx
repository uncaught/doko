import React, {Fragment, ReactElement} from 'react';
import {Header, Message} from 'semantic-ui-react';
import {useSortedGroupMembers} from '../../store/GroupMembers';
import {useGroup} from '../../store/Groups';

export default function TopUpByAverage(): ReactElement {
  const {completedRoundsCount} = useGroup()!;
  const groupMembers = useSortedGroupMembers();
  let realPot = 0;
  let topUpPot = 0;

  const mapped = groupMembers.map(({id, name, euroBalance, roundsCount}) => {
    const euros = euroBalance || 0;
    const missedRounds = completedRoundsCount - roundsCount;
    const averageBalance = euros / roundsCount;
    realPot += euros;
    const topUp = missedRounds * averageBalance;
    topUpPot += topUp;
    const total = euros + topUp;
    const row = <Fragment key={id}>
      <div className={'name'}>{name}</div>
      <div className={'value'}>{euros.toFixed(2)} €</div>
      <div className={'value'}>{missedRounds} x {averageBalance.toFixed(2)} €</div>
      <div className={'value'}>{total.toFixed(2)} €</div>
    </Fragment>;
    return {id, row, total};
  });
  mapped.sort((a, b) => a.total - b.total);

  const toppedUpPot = realPot + topUpPot;

  return <section>
    <Header>#2 Pott-Auffüllung via Durchschnitt</Header>
    <Message>
      <Message.Content>
        <p>Der Pott wird mit dem durchschnittlichen Geldbetrag pro Runde eines jeden Spielers aufgestockt.</p>
        <p>Es wird so die 100% Teilnahme jedes Spielers simuliert.</p>
        <p>Der Pott erhöht sich von {realPot.toFixed(2)} € auf {toppedUpPot.toFixed(2)} €.</p>
      </Message.Content>
    </Message>

    <div className={'potGrid topUpByAverage'}>
      <div className={'name'}/>
      <div className={'value'}>Beitrag</div>
      <div className={'value'}>Ausgleich</div>
      <div className={'value'}>Total</div>
      {mapped.map(({row}) => row)}
    </div>
  </section>;
}

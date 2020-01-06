import React, {ReactElement} from 'react';
import {Icon, Table} from 'semantic-ui-react';
import {useActivePlayers} from '../../store/Players';
import {useSortedGames} from '../../store/Games';
import {useGroupMembers} from '../../store/GroupMembers';
import {useHistory, useRouteMatch} from 'react-router-dom';
import AddGame from '../round/AddGame';

export default function Games(): ReactElement {
  const players = useActivePlayers();
  const games = useSortedGames();
  const members = useGroupMembers();
  const sumMap = new Map<string, number>();
  const history = useHistory();
  const {url} = useRouteMatch();

  return <section>
    <Table basic unstackable className="gamesTable" textAlign='center'>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing>#</Table.HeaderCell>
          <Table.HeaderCell collapsing><Icon name={'hand paper outline'}/></Table.HeaderCell>
          <Table.HeaderCell collapsing><Icon name={'bullseye'}/></Table.HeaderCell>
          {players.map((p) =>
            <Table.HeaderCell key={p.groupMemberId}>{members[p.groupMemberId].name[0]}</Table.HeaderCell>)}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {games.map(({id, gameNumber, data, dealerGroupMemberId}) => {
          const {gamePoints, re, contra, isComplete, winner} = data;
          return <Table.Row key={id} onClick={() => history.push(`${url}/game/${id}`)}>
            <Table.Cell>{gameNumber}</Table.Cell>
            <Table.Cell>{members[dealerGroupMemberId].name[0]}</Table.Cell>
            <Table.Cell>{isComplete ? gamePoints : ''}</Table.Cell>
            {players.map((p) => {
              const isRe = re.members.includes(p.groupMemberId);
              const isContra = !isRe && contra.members.includes(p.groupMemberId);

              if ((!isRe && !isContra) || !isComplete) {
                return <Table.Cell key={p.groupMemberId}>{isComplete ? '-' : ''}</Table.Cell>;
              }

              const points = data[isRe ? 're' : 'contra'].totalPoints;
              const newPoints = (sumMap.get(p.groupMemberId) || 0) + points;
              sumMap.set(p.groupMemberId, newPoints);

              const hasWon = (winner === 're' && isRe) || (winner === 'contra' && isContra);
              const hasLost = !hasWon && winner !== 'stalemate';

              return <Table.Cell positive={hasWon}
                                 negative={hasLost}
                                 key={p.groupMemberId}
                                 className={isRe ? 'gamesTable-cell--isRe' : 'gamesTable-cell--isContra'}>
                {newPoints}
                {isRe && <span className={'gamesTable-cell-re'}>RE</span>}
              </Table.Cell>;
            })}
          </Table.Row>;
        })}
      </Table.Body>
    </Table>

    <AddGame/>
  </section>;
}

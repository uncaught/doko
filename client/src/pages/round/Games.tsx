import React, {ReactElement} from 'react';
import {Icon, Table} from 'semantic-ui-react';
import {useActivePlayers} from '../../store/Players';
import {useSortedGames} from '../../store/Games';
import {useFullParams} from '../../Page';
import {useSelector} from 'react-redux';
import {groupMembersSelector} from '../../store/GroupMembers';

export default function Games(): ReactElement {
  const players = useActivePlayers();
  const games = useSortedGames();
  const {groupId} = useFullParams<{ groupId: string }>();
  const members = useSelector(groupMembersSelector)[groupId];
  const sumMap = new Map<string, number>();

  return <section>
    <Table basic unstackable striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>#</Table.HeaderCell>
          <Table.HeaderCell><Icon name={'hand paper'}/></Table.HeaderCell>
          {players.map((p) =>
            <Table.HeaderCell key={p.groupMemberId}>{members[p.groupMemberId].name[0]}</Table.HeaderCell>)}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {games.map((g) => <Table.Row>
          <Table.Cell>{g.gameNumber}</Table.Cell>
          <Table.Cell>{members[g.dealerGroupMemberId].name[0]}</Table.Cell>
          {players.map((p) => {
            const prev = sumMap.get(p.groupMemberId) || 0;
            const points = g.data.re.members.includes(p.groupMemberId)
              ? g.data.re.totalPoints
              : g.data.contra.totalPoints;
            const newPoints = prev + points;
            sumMap.set(p.groupMemberId, newPoints);
            return <Table.Cell key={p.groupMemberId}>{newPoints}</Table.Cell>;
          })}
        </Table.Row>)}
      </Table.Body>
    </Table>
  </section>;
}

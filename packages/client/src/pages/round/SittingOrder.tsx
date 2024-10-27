import {GroupGroupMembers, GroupMember, Player} from '@doko/common';
import {arrayMoveImmutable as arrayMove} from 'array-move';
import React, {ReactElement} from 'react';
import {Link} from 'react-router-dom';
import {SortableContainer, SortableElement, SortableHandle, SortEndHandler} from 'react-sortable-hoc';
import {Header, List, Message} from 'semantic-ui-react';
import Page from '../../Page';
import {useGroupMembers} from '../../store/GroupMembers';
import {usePatchAttendance, usePatchSittingOrder, usePlayers} from '../../store/Players';

interface SortableItemProps {
  player: Player;
  member: GroupMember;
}

function getDescription({joinedAfterGameNumber, leftAfterGameNumber}: Player): string {
  if (leftAfterGameNumber === 0) {
    return `Nicht dabei`;
  }
  if (leftAfterGameNumber) {
    return `Gegangen nach Spiel #${leftAfterGameNumber}`;
  }
  if (joinedAfterGameNumber) {
    return `Hinzugekommen nach Spiel #${joinedAfterGameNumber}`;
  }
  return `Ist dabei`;
}

const DragHandle = SortableHandle(() => (
  <List.Content floated='right'>
    <List.Icon name={'arrows alternate vertical'} size={'large'} className='listDragHandle' />
  </List.Content>
));

function UserIcon({player: {groupMemberId, leftAfterGameNumber}}: {player: Player}): ReactElement {
  const patchAttendance = usePatchAttendance();
  return (
    <List.Icon
      color={leftAfterGameNumber === null ? 'green' : 'red'}
      name={leftAfterGameNumber === null ? 'user delete' : 'user plus'}
      size={'large'}
      onClick={() => patchAttendance(groupMemberId)}
      verticalAlign='middle'
    />
  );
}

const SortableItem = SortableElement<SortableItemProps>(({member, player}: SortableItemProps) => (
  <List.Item>
    <DragHandle />
    <UserIcon player={player} />
    <List.Content>
      <List.Header>{member.name}</List.Header>
      <List.Description className='u-font-smaller'>{getDescription(player)}</List.Description>
    </List.Content>
  </List.Item>
));

interface SortableListProps {
  members: GroupGroupMembers;
  players: Player[];
}

const SortableList = SortableContainer<SortableListProps>(({members, players}: SortableListProps) => {
  return (
    <List divided relaxed>
      {players.map((player, index) => (
        <SortableItem
          key={`player-${player.groupMemberId}`}
          index={index}
          player={player}
          member={members[player.groupMemberId]!}
        />
      ))}
    </List>
  );
});

export default function SittingOrder(): ReactElement | null {
  const members = useGroupMembers();
  const players = usePlayers();
  const patchSittingOrder = usePatchSittingOrder();
  if (!members) {
    return null;
  }

  const onSortEnd: SortEndHandler = ({oldIndex, newIndex}) => {
    patchSittingOrder(arrayMove(players, oldIndex, newIndex).map(({groupMemberId}) => groupMemberId));
  };

  const helperContainer = document.getElementById('dragItemListContainer')!;

  return (
    <Page displayName={'Mitspieler'}>
      <section>
        <Header as='h4'>Sitzreihenfolge</Header>
        <SortableList
          members={members}
          players={players}
          onSortEnd={onSortEnd}
          helperContainer={helperContainer}
          useDragHandle
        />
        <Message info>
          <p>Bitte so sortieren, dass der erste Geber oben steht.</p>
          <p>
            Mitspieler können auch noch während einer Runde durch Klick auf das Spieler-Symbol hinzugefügt oder entfernt
            werden.
          </p>
        </Message>

        <Link to={'..'}>zu den Spielen</Link>
      </section>
    </Page>
  );
}

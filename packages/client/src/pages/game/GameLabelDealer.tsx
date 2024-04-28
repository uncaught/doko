import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {useGame} from '../../store/Games';
import {useGroupMembers, useMemberInitials} from '../../store/GroupMembers';

export default function GameLabelDealer(): ReactElement {
  const game = useGame()!;
  const groupMembers = useGroupMembers();
  const initials = useMemberInitials();
  const dealer = groupMembers[game.dealerGroupMemberId];
  return <div className='memberDetail'>
    <Label color={dealer.isYou ? 'teal' : 'blue'}>
      {initials[dealer.id]} <Icon name={'hand paper outline'}/>
    </Label>
  </div>;
}

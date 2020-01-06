import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {useGame} from '../../store/Games';
import {useGroupMembers} from '../../store/GroupMembers';

export default function Dealer(): ReactElement {
  const game = useGame()!;
  const groupMembers = useGroupMembers();
  const dealer = groupMembers[game.dealerGroupMemberId];
  return <div className="u-flex-row u-flex-wrap">

    <div className="memberDetail">
      <Label color={'orange'}>
        {game.gameNumber} <Icon name={'hashtag'}/>
      </Label>
    </div>

    <div className="memberDetail">
      <Label color={dealer.isYou ? 'teal' : 'blue'}>
        Geber
        <Label.Detail>
          {dealer.name} <Icon name={'hand paper outline'}/>
        </Label.Detail>
      </Label>
    </div>
  </div>;
}

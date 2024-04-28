import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {useGame} from '../../store/Games';

export default function GameLabelNumber(): ReactElement {
  const game = useGame()!;
  return <div className='memberDetail'>
    <Label color={'orange'}>
      {game.gameNumber} <Icon name={'hashtag'}/>
    </Label>
  </div>;
}

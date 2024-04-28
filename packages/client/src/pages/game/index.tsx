import React, {ReactElement} from 'react';
import {Segment} from 'semantic-ui-react';
import {useGame} from '../../store/Games';
import FinishButton from './FinishButton';
import GameLabels from './GameLabels';
import GameTypeSelection from './GameTypeSelection';
import HeartsTrickToggle from './HeartsTrickToggle';
import NonPenalty from './NonPenalty';
import Penalty from './Penalty';
import SoloTypeSelection from './SoloTypeSelection';

export default function GameIndex(): ReactElement | null {
  const game = useGame();
  if (!game) {
    return null;
  }

  const isPenalty = game.data.gameType === 'penalty';

  return <section>
    <GameLabels/>
    <Segment vertical className='u-flex-row u-flex-wrap'>
      <GameTypeSelection/>
      <SoloTypeSelection/>
      <HeartsTrickToggle/>
    </Segment>
    {isPenalty && <Penalty/>}
    {!isPenalty && <NonPenalty/>}

    <FinishButton/>
  </section>;
}

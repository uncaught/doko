import React, {ReactElement} from 'react';
import {Segment} from 'semantic-ui-react';
import {useGame} from '../../store/Games';
import GameTypeSelection from './GameTypeSelection';
import SoloTypeSelection from './SoloTypeSelection';
import Penalty from './Penalty';
import NonPenalty from './NonPenalty';

export default function (): ReactElement | null {
  const game = useGame();
  if (!game) {
    return null;
  }

  const isPenalty = game.data.gameType === 'penalty';

  return <section>
    <Segment vertical className="u-flex-row u-flex-wrap">
      <GameTypeSelection/>
      <SoloTypeSelection/>
    </Segment>
    {isPenalty && <Penalty/>}
    {!isPenalty && <NonPenalty/>}
  </section>;
}

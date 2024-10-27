import React, {ReactElement} from 'react';
import {Segment} from 'semantic-ui-react';
import Page from '../../Page';
import {useGame} from '../../store/Games';
import ExtraSidebar from './ExtraSidebar';
import FinishButton from './FinishButton';
import GameLabels from './GameLabels';
import GameTypeSelection from './GameTypeSelection';
import HeartsTrickToggle from './HeartsTrickToggle';
import NonPenalty from './NonPenalty';
import Penalty from './Penalty';
import RemoveGameMenuItem from './RemoveGameMenuItem';
import SoloTypeSelection from './SoloTypeSelection';

export default function GameIndex(): ReactElement | null {
  const game = useGame();
  if (!game) {
    return null;
  }

  const isPenalty = game.data.gameType === 'penalty';

  return (
    <Page displayName={'Spiel'} menuItems={[RemoveGameMenuItem]} ExtraSidebar={ExtraSidebar}>
      <section>
        <GameLabels />
        <Segment vertical className='u-flex-row u-flex-wrap'>
          <GameTypeSelection />
          <SoloTypeSelection />
          <HeartsTrickToggle />
        </Segment>
        {isPenalty && <Penalty />}
        {!isPenalty && <NonPenalty />}

        <FinishButton />
      </section>
    </Page>
  );
}

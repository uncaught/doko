import React, {ReactElement} from 'react';
import GameLabelBock from './GameLabelBock';
import GameLabelComplete from './GameLabelComplete';
import GameLabelDealer from './GameLabelDealer';
import GameLabelNext from './GameLabelNext';
import GameLabelNumber from './GameLabelNumber';
import GameLabelPrev from './GameLabelPrev';

export default function GameLabels(): ReactElement {
  return (
    <div className='u-flex-row-between u-flex-wrap'>
      <GameLabelPrev />
      <GameLabelNumber />
      <GameLabelBock />
      <GameLabelDealer />
      <GameLabelComplete />
      <GameLabelNext />
    </div>
  );
}

import React, {ReactElement} from 'react';
import GameLabelComplete from './GameLabelComplete';
import GameLabelNext from './GameLabelNext';
import GameLabelPrev from './GameLabelPrev';
import GameLabelDealer from './GameLabelDealer';
import GameLabelNumber from './GameLabelNumber';
import GameLabelBock from './GameLabelBock';

export default function GameLabels(): ReactElement {
  return <div className="u-flex-row-between u-flex-wrap">
    <GameLabelPrev/>
    <GameLabelNumber/>
    <GameLabelBock/>
    <GameLabelDealer/>
    <GameLabelComplete/>
    <GameLabelNext/>
  </div>;
}

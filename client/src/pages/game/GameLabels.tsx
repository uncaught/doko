import React, {ReactElement} from 'react';
import GameLabelComplete from './GameLabelComplete';
import GameLabelNext from './GameLabelNext';
import GameLabelPrev from './GameLabelPrev';
import GameLabelDealer from './GameLabelDealer';
import GameLabelNumber from './GameLabelNumber';

export default function GameLabels(): ReactElement {
  return <div className="u-flex-row-between u-flex-wrap">
    <GameLabelPrev/>
    <GameLabelNumber/>
    <GameLabelDealer/>
    <GameLabelComplete/>
    <GameLabelNext/>
  </div>;
}

import React from 'react';
import NonPenalty from './game/NonPenalty';
import {Divider} from 'semantic-ui-react';

export default function Simulation(): React.ReactElement {
  return <div className="u-relative">
    <span>Simulation der Spielpunkte - einige Funktionen sind eingeschränkt</span>
    <Divider/>
    <NonPenalty/>
  </div>;
}

import React from 'react';
import {Divider} from 'semantic-ui-react';
import NonPenalty from './game/NonPenalty';

export default function Simulation(): React.ReactElement {
  return <div className='u-relative'>
    <span>Simulation der Spielpunkte - einige Funktionen sind eingeschränkt</span>
    <Divider/>
    <NonPenalty/>
  </div>;
}

import React from 'react';
import {Divider} from 'semantic-ui-react';
import Page from '../Page';
import RegularInput from './game/RegularInput';

export default function Simulation(): React.ReactElement {
  return (
    <Page displayName={'Simulation'}>
      <div className='u-relative'>
        <span>Simulation der Spielpunkte - einige Funktionen sind eingeschränkt</span>
        <Divider />
        <RegularInput />
      </div>
    </Page>
  );
}

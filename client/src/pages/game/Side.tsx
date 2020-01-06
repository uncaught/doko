import React, {ReactElement} from 'react';
import {Grid} from 'semantic-ui-react';
import Announcing from './Announcing';
import SidePlayers from './SidePlayers';
import ExtraPoints from './ExtraPoints';

export default function Side({isRe}: { isRe: boolean }): ReactElement | null {
  return <Grid.Column>
    <div className="u-flex-row u-flex-wrap">
      <Announcing type={'announced'} label={isRe ? 'Re' : 'Contra'} isRe={isRe}/>
      <Announcing type={'no9'} label={'keine 9'} isRe={isRe}/>
      <Announcing type={'no6'} label={'keine 6'} isRe={isRe}/>
      <Announcing type={'no3'} label={'keine 3'} isRe={isRe}/>
      <Announcing type={'no0'} label={'schwarz'} isRe={isRe}/>
    </div>
    <ExtraPoints isRe={isRe}/>
    <SidePlayers isRe={isRe}/>
  </Grid.Column>;
}

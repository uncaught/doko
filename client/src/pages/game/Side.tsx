import React, {ReactElement} from 'react';
import {Grid} from 'semantic-ui-react';
import Announcing from './Announcing';
import SidePlayers from './SidePlayers';
import ExtraPoints from './ExtraPoints';

export default function Side({isRe}: { isRe: boolean }): ReactElement | null {
  return <Grid.Column>
    <div className="u-flex-row u-flex-wrap">
      <Announcing type={'announced'} label={isRe ? 'Re' : 'Contra'} isRe={isRe}/>
      <div className="u-flex-row u-flex-wrap">
        <Announcing type={'no9'} label={'9'} text={'keine 9'} isRe={isRe}/>
        <Announcing type={'no6'} label={'6'} text={'keine 6'} isRe={isRe}/>
        <Announcing type={'no3'} label={'3'} text={'keine 3'} isRe={isRe}/>
        <Announcing type={'no0'} label={'0'} text={'schwarz'} isRe={isRe}/>
      </div>
    </div>
    <ExtraPoints isRe={isRe}/>
    <SidePlayers isRe={isRe}/>
  </Grid.Column>;
}

import React, {ReactElement} from 'react';
import Announcing from './Announcing';

export default function Announcements({isRe}: { isRe: boolean }): ReactElement {
  return <div className="u-flex-row u-flex-wrap u-margin-top-tiny">
    <Announcing type={'announced'} label={isRe ? 'Re' : 'Contra'} isRe={isRe}/>
    <div className="u-flex-row u-flex-wrap">
      <Announcing type={'no9'} label={'9'} text={'keine 9'} isRe={isRe}/>
      <Announcing type={'no6'} label={'6'} text={'keine 6'} isRe={isRe}/>
      <Announcing type={'no3'} label={'3'} text={'keine 3'} isRe={isRe}/>
      <Announcing type={'no0'} label={'0'} text={'schwarz'} isRe={isRe}/>
    </div>
  </div>;
}

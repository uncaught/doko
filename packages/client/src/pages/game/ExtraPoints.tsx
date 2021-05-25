import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import {useGame} from '../../store/Games';
import {soloLikeGameTypes} from '@doko/common';
import ExtraPointEntry from './ExtraPointEntry';

export default function ExtraPoints({isRe}: { isRe: boolean }): ReactElement {
  const {data} = useGame()!;
  const isSoloLike = soloLikeGameTypes.includes(data.gameType);
  const extraPoints = data[isRe ? 're' : 'contra'].extraPoints;
  return <>
    {!isSoloLike && <>
      <Divider className="tiny"/>
      <div className="u-flex-row u-flex-wrap">
        {extraPoints.map((_, index) => <ExtraPointEntry key={index} isRe={isRe} index={index}/>)}
        <ExtraPointEntry key={-1} isRe={isRe} index={-1}/>
      </div>
    </>}
  </>;
}

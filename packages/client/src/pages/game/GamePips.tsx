import {pipRanges, reversedPipRanges} from '@doko/common';
import React, {ReactElement} from 'react';
import {Divider, Label} from 'semantic-ui-react';
import {useGame, usePatchGame} from '../../store/Games';

export default function GamePips({isRe}: {isRe: boolean}): ReactElement {
  const {data} = useGame()!;
  const patchGame = usePatchGame();
  const sideKey = isRe ? 're' : 'contra';
  const otherSideKey = isRe ? 'contra' : 're';
  const selected = data[sideKey].pips;
  return <>
    <Divider className='tiny'/>
    <Label.Group circular className='pointsGroup u-flex-row-around u-flex-wrap'>
      {reversedPipRanges.map((range, idx) => {
        let display: string = range;
        let className = '';
        if (range.includes('-')) {
          display = range.split('-')[0] + '+';
          className = 'range';
        }
        return <Label key={range}
                      onClick={() => {
                        patchGame({
                          data: {
                            [sideKey]: {pips: range},
                            [otherSideKey]: {pips: pipRanges[idx]},
                          },
                        });
                      }}
                      color={selected === range ? 'green' : undefined}
                      className={className}>{display}</Label>;
      })}
    </Label.Group>
  </>;
}

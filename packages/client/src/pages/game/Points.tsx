import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import PointsLabel from '../../components/PointsLabel';
import {useGame} from '../../store/Games';

export default function Points({isRe}: {isRe: boolean}): ReactElement | null {
  const {data} = useGame()!;
  if (!data.isComplete) {
    return null;
  }

  const sideKey = isRe ? 're' : 'contra';
  const otherSideKey = isRe ? 'contra' : 're';
  const hasWon = data.winner === sideKey;
  const hasLost = data.winner === otherSideKey;
  const points = data[sideKey].totalPoints;

  return (
    <>
      <Divider className='tiny' />
      <PointsLabel green={hasWon} points={points} red={hasLost} />
    </>
  );
}

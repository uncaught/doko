import React, {ReactElement} from 'react';
import {Divider, Label} from 'semantic-ui-react';
import {useGame} from '../../store/Games';

export default function Points({isRe}: { isRe: boolean }): ReactElement | null {
  const {data} = useGame()!;
  if (!data.isComplete) {
    return null;
  }

  const sideKey = isRe ? 're' : 'contra';
  const otherSideKey = isRe ? 'contra' : 're';
  const hasWon = data.winner === sideKey;
  const hasLost = data.winner === otherSideKey;
  const points = data[sideKey].totalPoints;

  return <>
    <Divider className="tiny"/>
    <div className="memberDetail">
      <Label color={hasWon ? 'green' : (hasLost ? 'red' : undefined)}>
        Punkte
        <Label.Detail>{points}</Label.Detail>
      </Label>
    </div>
  </>;
}

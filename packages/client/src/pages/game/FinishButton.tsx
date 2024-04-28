import {Form, Segment} from 'semantic-ui-react';
import React from 'react';
import {undecided, useGame, usePatchGame} from '../../store/Games';
import {soloGameTypes} from '@doko/common';

export default function FinishButton(): React.ReactElement | null {
  const {data} = useGame()!;
  const patchGame = usePatchGame();
  if (data.isComplete
    || (data.gameType !== 'penalty' && (undecided(data).length > 0
      || (soloGameTypes.includes(data.gameType) && data.soloType === null)))) {
    return null;
  }
  return <Segment vertical>
    <Form.Button onClick={() => patchGame({data: {isComplete: true}})}>Abschließen</Form.Button>
  </Segment>;
}

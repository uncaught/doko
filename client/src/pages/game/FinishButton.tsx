import {Form, Segment} from 'semantic-ui-react';
import React from 'react';
import {undecided, useGame, usePatchGame} from '../../store/Games';
import {usePageContext} from '../../Page';
import {useHistory} from 'react-router-dom';
import {soloGameTypes} from '@doko/common';

export default function FinishButton(): React.ReactElement | null {
  const {data} = useGame()!;
  const patchGame = usePatchGame();
  const {parents} = usePageContext();
  const history = useHistory();
  if (data.isComplete
    || (data.gameType !== 'penalty' && (undecided(data).length > 0
      || (soloGameTypes.includes(data.gameType) && data.soloType === null)))) {
    return null;
  }
  return <Segment vertical>
    <Form.Button onClick={() => {
      patchGame({data: {isComplete: true}});
      if (data.gameType === 'penalty') {
        history.push(parents[0].url);
      }
    }}>Abschließen</Form.Button>
  </Segment>;
}

import {Form, Segment} from 'semantic-ui-react';
import React from 'react';
import {useGame, useGamePlayers, usePatchGame} from '../../store/Games';
import {useFullParams} from '../../Page';
import {useHistory} from 'react-router-dom';
import {soloGameTypes} from '@doko/common';

export default function FinishButton(): React.ReactElement | null {
  const {data} = useGame()!;
  const patchGame = usePatchGame();
  const {parents} = useFullParams();
  const history = useHistory();
  const gamePlayers = useGamePlayers()!;
  if (data.isComplete
    || (data.gameType !== 'penalty' && (gamePlayers.undecided.length > 0
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

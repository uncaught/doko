import {Form, Segment} from 'semantic-ui-react';
import React from 'react';
import {useGame, useGamePlayers, usePatchGame} from '../../store/Games';
import {useFullParams} from '../../Page';
import {useHistory} from 'react-router-dom';

export default function FinishButton(): React.ReactElement | null {
  const game = useGame()!;
  const patchGame = usePatchGame();
  const {parents} = useFullParams();
  const history = useHistory();
  const gamePlayers = useGamePlayers()!;
  if (game.data.isComplete || (game.data.gameType !== 'penalty' && gamePlayers.undecided.length > 0)) {
    return null;
  }
  return <Segment vertical>
    <Form.Button onClick={() => {
      patchGame({data: {isComplete: true}});
      if (game.data.gameType === 'penalty') {
        history.push(parents[0].url);
      }
    }}>Abschließen</Form.Button>
  </Segment>;
}

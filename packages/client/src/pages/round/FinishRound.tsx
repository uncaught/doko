import React, {ReactElement} from 'react';
import {Form} from 'semantic-ui-react';
import {useRound} from '../../store/Rounds';
import {useSortedGames} from '../../store/Games';
import {useFinishRound} from '../../store/Round/FinishRound';
import FinishRoundPrematurely from './FinishRoundPrematurely';

export default function FinishRound(): ReactElement | null {
  const round = useRound()!;
  const sortedGames = useSortedGames();
  const lastGame = sortedGames[sortedGames.length - 1];
  const finishRound = useFinishRound();

  if (round.endDate || !lastGame) {
    return null;
  }

  if (lastGame.data.isLastGame) {
    return <section>
      <Form.Button color={'teal'} onClick={finishRound}>Runde abschließen</Form.Button>
    </section>;
  } else {
    return <FinishRoundPrematurely/>;
  }
}

import React, {ReactElement} from 'react';
import {Form} from 'semantic-ui-react';
import {useFinishRound, useRound} from '../../store/Rounds';
import {useSortedGames} from '../../store/Games';

export default function FinishRound(): ReactElement | null {
  const round = useRound()!;
  const sortedGames = useSortedGames();
  const lastGame = sortedGames[sortedGames.length - 1];
  const finishRound = useFinishRound();

  if (round.endDate || !lastGame || !lastGame.data.isLastGame) {
    return null;
  }

  return <section>
    <Form.Button onClick={finishRound}>Runde Abschließen</Form.Button>
  </section>;
}

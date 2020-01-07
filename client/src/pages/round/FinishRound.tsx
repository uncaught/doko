import React, {ReactElement} from 'react';
import {Form} from 'semantic-ui-react';
import {usePatchRound, useRound} from '../../store/Rounds';
import {useSortedGames} from '../../store/Games';

export default function FinishRound(): ReactElement | null {
  const round = useRound()!;
  const sortedGames = useSortedGames();
  const lastGame = sortedGames[sortedGames.length - 1];
  const patchRound = usePatchRound();

  if (round.endDate || !lastGame || !lastGame.data.isLastGame) {
    return null;
  }

  return <section>
    <Form.Button onClick={() => {
      patchRound({endDate: Math.round(Date.now() / 1000)});
    }}>Runde Abschließen</Form.Button>
  </section>;
}

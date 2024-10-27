import React, {ReactElement, useState} from 'react';
import {Button, Divider, Form, Header, Icon, Modal} from 'semantic-ui-react';
import NumberStepper from '../../components/NumberStepper';
import {useSortedGames} from '../../store/Games';
import {usePlayersWithStats} from '../../store/Players';
import {usePatchRound, useRound} from '../../store/Rounds';

export default function RoundEndInfoPopup({
  duration,
  endKnown,
  setOpen,
}: {
  duration: number | null;
  endKnown: boolean;
  setOpen: (open: boolean) => void;
}): ReactElement {
  const {data} = useRound()!;
  const patchRound = usePatchRound();
  const sortedGames = useSortedGames();
  const lastGameRunNumber = sortedGames.length ? sortedGames[sortedGames.length - 1]!.data.runNumber : 1;
  const [remaining, setRemaining] = useState(data.roundDuration ? data.roundDuration - lastGameRunNumber : 1);
  const playersWithStats = usePlayersWithStats();
  const activePlayersWithoutSolo = playersWithStats.filter(
    (p) => p.player.leftAfterGameNumber === null && !p.dutySoloPlayed,
  ).length;

  return (
    <>
      <Header>
        <Icon name={'sync alternate'} />
        Spielende
      </Header>
      <Modal.Content>
        <p>Wir befinden uns derzeit in Durchgang {lastGameRunNumber}.</p>

        {endKnown && <p>Das Spiel endet nach {duration} Durchgängen.</p>}

        {activePlayersWithoutSolo > 0 && (
          <p style={{color: '#fbbd08'}}>
            {activePlayersWithoutSolo === 1 && `Es muss noch ein Spieler sein Solo spielen!`}
            {activePlayersWithoutSolo !== 1 && `Es müssen noch ${activePlayersWithoutSolo} Spieler ihr Solo spielen!`}
          </p>
        )}

        {data.dynamicRoundDuration && (
          <>
            <Divider section />

            <Form className='u-flex-row-around u-align-center'>
              <Form.Field>Noch</Form.Field>
              <NumberStepper value={remaining} min={0} onChange={setRemaining} inverted />
              <Form.Field>volle Durchgänge</Form.Field>
            </Form>
          </>
        )}
      </Modal.Content>
      {data.dynamicRoundDuration && (
        <Modal.Actions>
          <Button
            inverted
            onClick={() => {
              patchRound({data: {roundDuration: lastGameRunNumber + remaining}});
              setOpen(false);
            }}
          >
            <Icon name='checkmark' /> Ok
          </Button>
        </Modal.Actions>
      )}
    </>
  );
}

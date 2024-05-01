import React, {ReactElement, useState} from 'react';
import {Button, Form, Header, Icon, Message, Modal} from 'semantic-ui-react';
import {useSortedGames} from '../../store/Games';
import {usePlayersWithStats} from '../../store/Players';
import {useFinishRound} from '../../store/Round/FinishRound';

export default function FinishRoundPrematurely(): ReactElement | null {
  const sortedGames = useSortedGames();
  const lastGame = sortedGames[sortedGames.length - 1];
  const finishRound = useFinishRound();
  const [open, setOpen] = useState(false);
  const players = usePlayersWithStats();
  const playersMissingSolo = players.filter(({dutySoloPlayed}) => !dutySoloPlayed);

  return <section>
    <Form.Button color={'grey'} size={'mini'} onClick={() => setOpen(true)}>Runde vorzeitig abschließen</Form.Button>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>
        <Icon name={'flag checkered'}/>
        Runde abschließen
      </Header>
      <Modal.Content>
        <p>Möchtest du die Runde jetzt nach {lastGame?.gameNumber || 0} Spielen wirklich abschließen?</p>
        {playersMissingSolo.length > 0 && <Message error visible>
          <Message.Header>Folgende Spieler haben noch nicht ihr Solo gespielt:</Message.Header>
          <Message.Content>{playersMissingSolo.map(({member}) => member.name).join(', ')}</Message.Content>
        </Message>}
      </Modal.Content>
      <Modal.Actions>
        <Button inverted onClick={() => {
          finishRound(true);
          setOpen(false);
        }}>
          <Icon name='checkmark'/> Ja, Runde vorzeitig abschließen
        </Button>
      </Modal.Actions>
    </Modal>
  </section>;
}

import React, {ReactElement, useState} from 'react';
import {Button, Header, Icon, Label, Modal} from 'semantic-ui-react';
import {useGame, usePatchGame, useSortedGames} from '../../store/Games';
import {useRound} from '../../store/Rounds';

export default function GameLabelComplete(): ReactElement | null {
  const game = useGame()!;
  const patchGame = usePatchGame();
  const sortedGames = useSortedGames();
  const isLastGame = game === sortedGames[sortedGames.length - 1];
  const [open, setOpen] = useState(false);
  const round = useRound()!;

  if (!game.data.isComplete && isLastGame) {
    return null;
  }

  return <>
    <div className='memberDetail'>
      {game.data.isComplete && <Label className={'iconOnly'} color={'red'} onClick={() => {
        if (!round.endDate) {
          setOpen(true);
        }
      }}>
        <Icon name={'lock'}/>
      </Label>}
      {!game.data.isComplete && <Label className={'iconOnly'} color={'yellow'}>
        <Icon name={'lock open'}/>
      </Label>}
    </div>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small'>
      <Header icon='pencil' content='Spiel wieder zur Bearbeitung öffnen?'/>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={() => setOpen(false)}>
          <Icon name='remove'/> Nein
        </Button>
        <Button color='green' inverted onClick={() => {
          patchGame({data: {isComplete: false}});
          setOpen(false);
        }}>
          <Icon name='checkmark'/> Ja
        </Button>
      </Modal.Actions>
    </Modal>
  </>;
}

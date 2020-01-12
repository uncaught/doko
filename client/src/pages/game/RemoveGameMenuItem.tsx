import React, {ReactElement, useState} from 'react';
import {Button, Header, Icon, Menu, Modal} from 'semantic-ui-react';
import {useGame, useRemoveGame, useSortedGames} from '../../store/Games';

export default function RemoveGameMenuItem({closeMenu}: { closeMenu: () => void }): ReactElement | null {
  const game = useGame()!;
  const sortedGames = useSortedGames();
  const removeGame = useRemoveGame();
  const [open, setOpen] = useState(false);
  const lastGame = sortedGames.length ? sortedGames[sortedGames.length - 1] : null;

  if (game !== lastGame || game.data.isComplete) {
    return null;
  }

  return <>
    <Menu.Item onClick={() => {
      closeMenu();
      setOpen(true);
    }}>
      <Icon name='delete'/>
      Aktuelles Spiel löschen
    </Menu.Item>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small'>
      <Header icon='remove' content='Aktuelles Spiel wirklich löschen?'/>
      <Modal.Actions>
        <Button color='red' inverted onClick={() => {
          setOpen(false);
          removeGame();
        }}>
          <Icon name='remove'/> Ja, löschen!
        </Button>
      </Modal.Actions>
    </Modal>
  </>;
}

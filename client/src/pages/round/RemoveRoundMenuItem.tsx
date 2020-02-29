import React, {ReactElement, useState} from 'react';
import {Button, Header, Icon, Menu, Modal} from 'semantic-ui-react';
import {useSortedGames} from '../../store/Games';
import {useRound} from '../../store/Rounds';
import {useRemoveRound} from '../../store/Round/RemoveRound';

export default function RemoveRoundMenuItem({closeMenu}: { closeMenu: () => void }): ReactElement | null {
  const round = useRound()!;
  const sortedGames = useSortedGames();
  const removeRound = useRemoveRound();
  const [open, setOpen] = useState(false);

  if (round.endDate || sortedGames.length) {
    return null;
  }

  return <>
    <Menu.Item onClick={() => {
      closeMenu();
      setOpen(true);
    }}>
      <Icon name='delete'/>
      Aktuelles Runde löschen
    </Menu.Item>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small'>
      <Header icon='remove' content='Aktuelle Runde wirklich löschen?'/>
      <Modal.Actions>
        <Button color='red' inverted onClick={() => {
          setOpen(false);
          removeRound();
        }}>
          <Icon name='remove'/> Ja, löschen!
        </Button>
      </Modal.Actions>
    </Modal>
  </>;
}

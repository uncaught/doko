import {Announce, announceChain, PatchableGame, soloLikeGameTypes} from '@doko/common';
import React, {ReactElement, useState} from 'react';
import {Button, Header, Icon, Label, Modal} from 'semantic-ui-react';
import {undecided, useGame, usePatchGame} from '../../store/Games';
import {useGroupMembers} from '../../store/GroupMembers';

export default function Announcing({type, label, text, isRe}: {
  type: Announce;
  label: string;
  text?: string;
  isRe: boolean
}): ReactElement {
  const {data} = useGame()!;
  const [open, setOpen] = useState(false);
  const members = useGroupMembers();
  const patchGame = usePatchGame();
  const sideKey = isRe ? 're' : 'contra';
  const otherSideKey = isRe ? 'contra' : 're';
  const party = data[sideKey];
  const isSoloLike = soloLikeGameTypes.includes(data.gameType);

  const selectAnnounce = (memberId: string) => {
    const gamePatch: PatchableGame = {data: {[sideKey]: {[type]: memberId}}};

    //Add member if not already existing on party:
    if (!party.members.includes(memberId)) {
      gamePatch.data![sideKey]!.members = [...party.members, memberId];

      //Move undecided players to the other party once two members are known:
      if (gamePatch.data![sideKey]!.members!.length === 2 || (isSoloLike && isRe)) {
        const otherPartyMembers = new Set(data.players);
        gamePatch.data![sideKey]!.members!.forEach((id) => otherPartyMembers.delete(id));
        gamePatch.data![otherSideKey] = {members: [...otherPartyMembers]};
      }
    }

    //Add upwards announces if not set (allows setting "no3" withough previous "no6" etc.
    for (const key of announceChain) {
      if (key === type) {
        break;
      }
      if (!party[key]) {
        gamePatch.data![sideKey]![key] = memberId;
      }
    }

    patchGame(gamePatch);
    setOpen(false);
  };

  const cancel = () => {
    const gamePatch: PatchableGame = {data: {[sideKey]: {[type]: null}}};
    for (const key of [...announceChain].reverse()) {
      if (key === type) {
        break;
      }
      if (party[key]) {
        gamePatch.data![sideKey]![key] = null;
      }
    }
    patchGame(gamePatch);
    setOpen(false);
  };

  const doOpen = () => {
    if (isRe && isSoloLike) {
      if (party[type]) {
        cancel();
      } else {
        selectAnnounce(data.gameTypeMemberId!);
      }
    } else {
      setOpen(true);
    }
  };

  return <div className='memberDetail'>
    <Label color={party[type] ? 'green' : undefined} onClick={doOpen}>
      {label} <Icon name={'trophy'}/>
    </Label>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>
        <Icon name={'trophy'}/>
        "{text || label}" {type === 'announced' ? 'angesagt' : 'abgesagt'} von
      </Header>
      <Modal.Content className='u-flex-row-around u-flex-wrap'>
        {[...party.members, ...undecided(data)].map((id) => <p key={id}>
          <Button onClick={() => selectAnnounce(id)}
                  color={party[type] === id ? 'green' : undefined}
                  inverted>
            <Icon name='user'/> {members[id]!.name}
          </Button>
        </p>)}
      </Modal.Content>
      {!!party[type] && <Modal.Actions className='u-text-center'>
        <Button basic inverted onClick={cancel}>
          <Icon name='ban'/> {type === 'announced' ? 'Ansage' : 'Absage'} aufheben
        </Button>
      </Modal.Actions>}
    </Modal>
  </div>;
}

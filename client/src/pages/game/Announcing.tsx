import {Announce, announceChain, PatchableGame, soloGameTypes, soloLikeGameTypes} from '@doko/common';
import React, {ReactElement, useState} from 'react';
import {useGame, useGamePlayers, usePatchGame} from '../../store/Games';
import {Button, Header, Icon, Label, Modal} from 'semantic-ui-react';

export default function Announcing({type, label, text, isRe}: { type: Announce; label: string; text?: string; isRe: boolean }): ReactElement {
  const game = useGame()!;
  const [open, setOpen] = useState(false);
  const gamePlayers = useGamePlayers()!;
  const patchGame = usePatchGame();
  const sideKey = isRe ? 're' : 'contra';
  const otherSideKey = isRe ? 'contra' : 're';
  const sidePlayers = gamePlayers[sideKey];
  const party = game.data[sideKey];
  const isSoloLike = soloLikeGameTypes.includes(game.data.gameType);

  const selectAnnounce = (memberId: string) => {
    const gamePatch: PatchableGame = {data: {[sideKey]: {[type]: memberId}}};

    //Add member if not already existing on party:
    if (!party.members.includes(memberId)) {
      gamePatch.data![sideKey]!.members = [...party.members, memberId];

      //Move undecided players to the other party once two members are known:
      if (gamePatch.data![sideKey]!.members!.length === 2 || (isSoloLike && isRe)) {
        const otherPartyMembers = new Set([
          ...game.data[otherSideKey].members,
          ...gamePlayers.undecided.map(({member}) => member.id),
        ]);
        otherPartyMembers.delete(memberId);
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
    if (isRe && soloGameTypes.includes(game.data.gameType)) {
      if (party[type]) {
        cancel();
      } else {
        selectAnnounce(game.data.gameTypeMemberId!);
      }
    } else {
      setOpen(true);
    }
  };

  return <div className="memberDetail">
    <Label color={party[type] ? 'green' : undefined} onClick={doOpen}>
      {label} <Icon name={'trophy'}/>
    </Label>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>
        <Icon name={'trophy'}/>
        "{text || label}" {type === 'announced' ? 'angesagt' : 'abgesagt'} von
      </Header>
      <Modal.Content>
        {[...sidePlayers, ...gamePlayers.undecided].map(({member}) => <p key={member.id}>
          <Button onClick={() => selectAnnounce(member.id)}
                  color={party[type] === member.id ? 'green' : undefined}
                  inverted>
            <Icon name='user'/> {member.name}
          </Button>
        </p>)}
      </Modal.Content>
      {!!party[type] && <Modal.Actions>
        <Button basic inverted onClick={cancel}>
          <Icon name='ban'/> {type === 'announced' ? 'Ansage' : 'Absage'} aufheben
        </Button>
      </Modal.Actions>}
    </Modal>
  </div>;
}

import {GroupMember, PatchableGame, soloLikeGameTypes} from '@doko/common';
import React, {ReactElement, useState} from 'react';
import {useGame, usePatchGame} from '../../store/Games';
import {Button, Header, Icon, Label, Modal} from 'semantic-ui-react';

export default function GamePlayer({member}: { member: GroupMember }): ReactElement {
  const game = useGame()!;
  const [open, setOpen] = useState(false);
  const patchGame = usePatchGame();
  const isSoloLike = soloLikeGameTypes.includes(game.data.gameType);

  const chooseSide = (shallBeRe: boolean) => {
    const sideKey = shallBeRe ? 're' : 'contra';
    const otherSideKey = shallBeRe ? 'contra' : 're';
    const inParty = game.data[sideKey].members.includes(member.id);
    if (inParty) {
      return; //nothing to do, already in party
    }

    const gamePatch: PatchableGame = {
      data: {
        [sideKey]: {
          members: [
            ...game.data[sideKey].members,
            member.id,
          ],
        },
      },
    };

    if (game.data[otherSideKey].members.includes(member.id)) {
      gamePatch.data![otherSideKey] = {members: game.data[otherSideKey].members.filter((id) => id !== member.id)};
    }

    //Move undecided players to the other party once two members are known:
    if (gamePatch.data![sideKey]!.members!.length === 2 || (isSoloLike && shallBeRe)) {
      const otherPartyMembers = new Set(game.data.players);
      gamePatch.data![sideKey]!.members!.forEach((id) => otherPartyMembers.delete(id));
      gamePatch.data![otherSideKey] = {members: [...otherPartyMembers]};
    }

    patchGame(gamePatch);
    setOpen(false);
  };

  return <div className="memberDetail">
    <Label onClick={() => setOpen(true)}>
      {member.name} <Icon name={'user'}/>
    </Label>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>Partei von {member.name}</Header>
      <Modal.Content className="u-flex-row-around u-flex-wrap">
        <Button inverted
                color={game.data.re.members.includes(member.id) ? 'green' : undefined}
                onClick={() => chooseSide(true)}>Re</Button>
        <Button inverted
                color={game.data.contra.members.includes(member.id) ? 'green' : undefined}
                onClick={() => chooseSide(false)}>Contra</Button>
      </Modal.Content>
    </Modal>
  </div>;
}

import {gameTypeTexts, GroupMember} from '@doko/common';
import React, {ReactElement} from 'react';
import {useGame} from '../../store/Games';
import {Button, Modal} from 'semantic-ui-react';
import {useSelectGamePlayerSide} from './SelectGamePlayerSide';

export default function GamePlayerSideModal({member, close}: { member: GroupMember; close: () => void }): ReactElement {
  const game = useGame()!;
  const isGameTypePlayer = game.data.gameTypeMemberId === member.id;
  const selectGamePlayerSide = useSelectGamePlayerSide();

  const chooseSide = (shallBeRe: boolean) => {
    if (selectGamePlayerSide(member.id, shallBeRe)) {
      close();
    }
  };

  return <Modal.Content className="u-flex-row-around u-flex-wrap">
    {isGameTypePlayer && <>
      <Button inverted color={'green'}>Re</Button>
      <div className={'u-flex-center'}>{member.name} spielt {gameTypeTexts.get(game.data.gameType)}</div>
    </>}
    {!isGameTypePlayer && <>
      <Button inverted
              color={game.data.re.members.includes(member.id) ? 'green' : undefined}
              onClick={() => chooseSide(true)}>Re</Button>
      <Button inverted
              color={game.data.contra.members.includes(member.id) ? 'green' : undefined}
              onClick={() => chooseSide(false)}>Contra</Button>
    </>}
  </Modal.Content>;
}

import {GameType, gameTypeTexts, getDefaultParty, soloGameTypes, soloLikeGameTypes} from '@doko/common';
import React, {ReactElement, useState} from 'react';
import {Button, Dropdown, Header, Icon, Modal} from 'semantic-ui-react';
import {useGame, usePatchGame} from '../../store/Games';
import {useGroupMembers} from '../../store/GroupMembers';
import {usePlayersWithStats} from '../../store/Players';

type DropdownType = 'normal'
  | 'solo'
  | 'poverty'
  | 'wedding'
  | 'silentWedding'
  | 'soloWedding'
  | 'penalty';

const types = new Map<DropdownType, {text: string}>([
  ['normal', {text: 'Normalspiel'}],
  ['solo', {text: 'Solo'}],
  ['poverty', {text: 'Armut'}],
  ['wedding', {text: 'Hochzeit'}],
  ['silentWedding', {text: 'Stille Hochzeit'}],
  ['soloWedding', {text: 'Solo Hochzeit'}],
  ['penalty', {text: 'Strafe'}],
]);

export default function GameTypeSelection(): ReactElement {
  const game = useGame()!;
  const patchGame = usePatchGame();
  const members = useGroupMembers();
  const playersWithStats = usePlayersWithStats();
  const [selectedType, setSelectedType] = useState<DropdownType>('normal');
  const [open, setOpen] = useState(false);
  const {gameType} = game.data;
  const isSolo = soloGameTypes.includes(gameType);

  const select = (type: DropdownType) => {
    if (type === 'normal') {
      patchGame({
        data: {
          isComplete: false,
          gameType: type,
          gameTypeMemberId: null,
          soloType: null,
          re: getDefaultParty(),
          contra: getDefaultParty(),
        },
      });
    } else {
      setSelectedType(type);
      setOpen(true);
    }
  };

  function determineSolo(memberId: string): GameType {
    const playerWithStats = playersWithStats.find(({member}) => member.id === memberId)!;
    return playerWithStats.dutySoloPlayed ? 'lustSolo' : 'dutySolo';
  }

  const commitType = (memberId: string) => {
    const realType: GameType = selectedType === 'solo' ? determineSolo(memberId) : selectedType;
    patchGame({
      data: {
        gameType: realType,
        gameTypeMemberId: memberId,
        re: {
          members: [memberId],
        },
        contra: {
          members: soloLikeGameTypes.includes(realType) ? game.data.players.filter((id) => id !== memberId) : [],
        },
        gamePoints: realType === 'penalty' ? 1 : 0,
        soloType: null,
        winner: realType === 'penalty' ? 'contra' : 'stalemate',
      },
    });
    setOpen(false);
  };

  return <div>
    <Dropdown
      text={gameTypeTexts.get(gameType)}
      icon='play'
      floating
      labeled
      button
      className='icon'
      disabled={gameType === 'forcedSolo'}
    >
      <Dropdown.Menu>
        <Dropdown.Header content='Spieltyp'/>
        <Dropdown.Divider/>
        {[...types].map(([type, {text}]) => <Dropdown.Item
          key={type}
          active={type === gameType || (type === 'solo' && isSolo)}
          onClick={() => select(type)}
          text={text}
        />)}
      </Dropdown.Menu>
    </Dropdown>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>
        <Icon name={'male'}/>
        {(types.get(selectedType) || {}).text} von
      </Header>
      <Modal.Content className='u-flex-row-around u-flex-wrap'>
        {game.data.players.map((id) => <p key={id}>
          <Button onClick={() => commitType(id)}
                  color={game.data.gameTypeMemberId === id ? 'green' : undefined}
                  inverted>
            <Icon name='user'/> {members[id]!.name}
          </Button>
        </p>)}
      </Modal.Content>
    </Modal>
  </div>;
}

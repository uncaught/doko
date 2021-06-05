import React, {ReactElement} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {useGame, usePatchGame} from '../../store/Games';
import {soloGameTypes, soloTypeTexts} from '@doko/common';
import {useGroup} from '../../store/Groups';

export default function SoloTypeSelection(): ReactElement | null {
  const group = useGroup()!;
  const game = useGame()!;
  const patchGame = usePatchGame();
  const {gameType, soloType} = game.data;

  if (!soloGameTypes.includes(gameType)) {
    return null;
  }

  return <div>
    <Dropdown
      text={soloType ? soloTypeTexts.get(soloType) : 'Solo-Typ'}
      icon='play'
      floating
      labeled
      button
      className='icon'
    >
      <Dropdown.Menu>
        <Dropdown.Header content='Solo'/>
        <Dropdown.Divider/>
        {[...soloTypeTexts].filter(([type]) => group.settings.allowedSoloTypes.includes(type))
                           .map(([type, text]) => <Dropdown.Item
                             key={type}
                             active={type === soloType}
                             onClick={() => patchGame({data: {soloType: type}})}
                             text={text}
                           />)}
      </Dropdown.Menu>
    </Dropdown>
  </div>;
}

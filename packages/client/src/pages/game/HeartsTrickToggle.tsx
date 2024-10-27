import {soloGameTypes, SoloType} from '@doko/common';
import React, {ReactElement} from 'react';
import {Button} from 'semantic-ui-react';
import {useGame, usePatchGame} from '../../store/Games';
import {useGroup} from '../../store/Groups';

const heartsTrickSoloTypes: SoloType[] = ['trump', 'clubs', 'spades'];

export default function HeartsTrickToggle(): ReactElement | null {
  const {settings} = useGroup()!;
  const game = useGame()!;
  const patchGame = usePatchGame();

  if (!settings.bockGames.heartsTrick) {
    return null;
  }

  const {gameType, soloType, heartsTrickWentThrough: isOn} = game.data;

  if (soloGameTypes.includes(gameType) && (!soloType || !heartsTrickSoloTypes.includes(soloType))) {
    return null;
  }

  return (
    <div>
      <Button
        icon={'heart'}
        color={isOn ? 'green' : undefined}
        onClick={() => patchGame({data: {heartsTrickWentThrough: !isOn}})}
      />
    </div>
  );
}

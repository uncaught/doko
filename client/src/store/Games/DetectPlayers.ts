import {GameData, Player} from '@doko/common';
import {findPlayerIndex} from '../Games';

export function detectPlayers(
  gameData: GameData,
  newGameDealerId: string,
  activePlayers: Player[],
): void {
  const nextDealerIndex = findPlayerIndex(activePlayers, newGameDealerId);
  gameData.players = [];
  for (let i = 1; i < 5; i++) {
    const pIndex = (nextDealerIndex + i) % activePlayers.length;
    const player = activePlayers[pIndex];
    gameData.players.push(player.groupMemberId);
  }
}


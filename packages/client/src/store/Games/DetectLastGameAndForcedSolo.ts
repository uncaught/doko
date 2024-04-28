import {Game, GameData, Player, RoundData} from '@doko/common';
import {findPlayerIndex} from '../Games';
import {PlayerStats} from '../Players';

export function detectLastGameAndForcedSolo(
  roundData: RoundData,
  gameData: GameData,
  sortedGames: Game[],
  newGameDealerId: string,
  activePlayers: Player[],
  playersWithStats: PlayerStats[],
): void {
  //Determine if the number of runs is known:
  if (!sortedGames.length || (roundData.dynamicRoundDuration && roundData.roundDuration === null)) {
    return;
  }

  //Determine whether we are in the last run - forced soli can only be in the last run:
  const duration = roundData.dynamicRoundDuration ? roundData.roundDuration : 6; //6 runs = 24 games
  if (duration !== gameData.runNumber) {
    return;
  }

  const nextDealerIndex = findPlayerIndex(activePlayers, newGameDealerId);
  const remainingRegularGames = activePlayers.length - nextDealerIndex;

  if (remainingRegularGames === 1) {
    gameData.isLastGame = true;
  }

  //Find the players that are still present and still need their solo:
  const open = playersWithStats.filter(({player, dutySoloPlayed}) => !dutySoloPlayed && activePlayers.includes(player));
  const openIndexes = open.map(({player}) => activePlayers.indexOf(player));
  const countIndexesAfterDealer = openIndexes.filter((idx) => idx > nextDealerIndex).length;

  if (open.length < remainingRegularGames

    //Make sure the player does not have to deal when he is supposed to have his forced solo:
    && (activePlayers.length < 5 || countIndexesAfterDealer !== 1 || remainingRegularGames > 2)
    && (activePlayers.length < 6 || countIndexesAfterDealer !== 2 || remainingRegularGames > 3)
  ) {
    return;
  }

  gameData.gameType = 'forcedSolo';
  gameData.re.members = [];
  gameData.contra.members = [];

  for (let i = 1; i < 5; i++) {
    const pIndex = (nextDealerIndex + i) % activePlayers.length;
    const player = activePlayers[pIndex];
    if (openIndexes.includes(pIndex) && gameData.re.members.length === 0) {
      gameData.gameTypeMemberId = player.groupMemberId;
      gameData.re.members.push(player.groupMemberId);
    } else {
      gameData.contra.members.push(player.groupMemberId);
    }
  }
}


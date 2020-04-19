import {Game, Player} from '@doko/common';

export function detectRunNumber(
  sortedGames: Game[],
  newGameDealerId: string,
  roundParticipatingPlayers: Player[],
): number {
  const roundParticipatingPlayerIds = roundParticipatingPlayers.map(({groupMemberId}) => groupMemberId);
  const newGameDealerRoundIndex = roundParticipatingPlayerIds.indexOf(newGameDealerId);
  let runNumber = 1;
  if (sortedGames.length) {
    let lastDealerRoundIndex = 0;
    sortedGames.forEach(({dealerGroupMemberId}) => {
      const dealerRoundIndex = roundParticipatingPlayerIds.indexOf(dealerGroupMemberId);
      if (dealerRoundIndex < lastDealerRoundIndex) {
        runNumber++;
      }
      lastDealerRoundIndex = dealerRoundIndex;
    });
    if (newGameDealerRoundIndex < lastDealerRoundIndex) {
      runNumber++;
    }
  }
  return runNumber;
}

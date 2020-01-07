import {Game} from '@doko/common';

export function detectRunNumber(
  sortedGames: Game[],
  newGameDealerId: string,
): number {
  let runNumber = 1;
  if (sortedGames.length) {
    const firstDealer = sortedGames[0].dealerGroupMemberId;
    let lastDealer = firstDealer;

    sortedGames.forEach(({gameNumber, data, dealerGroupMemberId}, idx) => {
      if (dealerGroupMemberId === firstDealer && lastDealer !== firstDealer) {
        runNumber++;
      }
      lastDealer = dealerGroupMemberId;
    });
    if (newGameDealerId === firstDealer && lastDealer !== firstDealer) {
      runNumber++;
    }
  }
  return runNumber;
}

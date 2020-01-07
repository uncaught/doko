import {Game, GroupSettings} from '@doko/common';

export function getBockGameWeight(
  bockInBockBehavior: GroupSettings['bockInBockBehavior'],
  sortedGames: Game[],
  newGameDealerId: string,
): number {
  let bockStack: Array<{ startingDealerId: string; hasDealerChangedOnce: boolean }> = [];
  let bockExtends = 0;

  const cleanForDealer = (dealerId: string): void => {
    //Clean bock stack of bocks that are over:
    bockStack = bockStack.filter(({startingDealerId, hasDealerChangedOnce}) => {
      return !hasDealerChangedOnce || startingDealerId !== dealerId;
    });
    if (bockStack.length === 0 && bockExtends > 0) {
      bockStack = [{startingDealerId: dealerId, hasDealerChangedOnce: false}];
      bockExtends--;
    }
  };

  sortedGames.forEach(({gameNumber, data, dealerGroupMemberId}, idx) => {
    if (data.gameType === 'penalty') {
      return;
    }

    //Mark if the dealer has changed
    bockStack.forEach((bock) => {
      if (!bock.hasDealerChangedOnce && bock.startingDealerId !== dealerGroupMemberId) {
        bock.hasDealerChangedOnce = true;
      }
    });

    const nextGame = sortedGames[idx + 1];
    const nextDealerId = nextGame ? nextGame.dealerGroupMemberId : newGameDealerId;

    cleanForDealer(dealerGroupMemberId);

    if (data.qualifiesNewBockGames) {
      const newBock = {startingDealerId: nextDealerId, hasDealerChangedOnce: false};
      if (bockStack.length > 0) {
        if (bockInBockBehavior === 'extend') {
          bockExtends++;
        } else if (bockInBockBehavior === 'restart') {
          bockStack = [newBock];
        } else if (bockInBockBehavior === 'stack') {
          bockStack.push(newBock);
        }
      } else {
        bockStack = [newBock];
      }
    }
  });

  cleanForDealer(newGameDealerId);

  return bockStack.length;
}

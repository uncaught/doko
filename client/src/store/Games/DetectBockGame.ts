import {Game, GameData, RoundData} from '@doko/common';

export function detectBockGame(
  roundData: RoundData,
  gameData: GameData,
  sortedGames: Game[],
  newGameDealerId: string,
): void {
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
        if (roundData.bockInBockBehavior === 'extend') {
          bockExtends++;
        } else if (roundData.bockInBockBehavior === 'restart') {
          bockStack = [newBock];
        } else if (roundData.bockInBockBehavior === 'stack') {
          bockStack.push(newBock);
        }
      } else {
        bockStack = [newBock];
      }
    }
  });

  cleanForDealer(newGameDealerId);

  gameData.bockGameWeight = bockStack.length;
}

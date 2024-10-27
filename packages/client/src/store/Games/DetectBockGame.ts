import {Game, GameData, Player, RoundData} from '@doko/common';

function isActiveInGame(player: Player, gameNumber: number): boolean {
  return (
    (player.leftAfterGameNumber === null || player.leftAfterGameNumber >= gameNumber) &&
    (player.joinedAfterGameNumber === null || player.joinedAfterGameNumber <= gameNumber)
  );
}

function findActivePlayerAtPosition(
  roundParticipatingPlayers: Player[],
  startingDealerId: string,
  gameNumber: number,
): string {
  const playersCount = roundParticipatingPlayers.length;
  const startingDealerIdx = roundParticipatingPlayers.findIndex(
    ({groupMemberId}) => groupMemberId === startingDealerId,
  );
  let curIndex = startingDealerIdx;
  let i = 0;
  while (!isActiveInGame(roundParticipatingPlayers[curIndex]!, gameNumber)) {
    curIndex = playersCount > curIndex + 1 ? curIndex + 1 : 0;
    i++;
    if (i > playersCount) {
      throw new Error('Bad loop detecting active player for bock game');
    }
  }
  return roundParticipatingPlayers[curIndex]!.groupMemberId;
}

export function detectBockGame(
  roundData: RoundData,
  gameData: GameData,
  sortedGames: Game[],
  newGameDealerId: string,
  newGameNumber: number,
  roundParticipatingPlayers: Player[],
): void {
  let bockStack: Array<{startingDealerId: string; hasDealerChangedOnce: boolean}> = [];
  let bockExtends = 0;

  const cleanForDealer = (dealerId: string, gameNumber: number): void => {
    //Clean bock stack of bocks that are over:
    bockStack = bockStack.filter(({startingDealerId, hasDealerChangedOnce}) => {
      const bockActiveStartingDealerId = findActivePlayerAtPosition(
        roundParticipatingPlayers,
        startingDealerId,
        gameNumber,
      );
      return !hasDealerChangedOnce || bockActiveStartingDealerId !== dealerId;
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

    cleanForDealer(dealerGroupMemberId, gameNumber);

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

  cleanForDealer(newGameDealerId, newGameNumber);

  gameData.bockGameWeight = bockStack.length;
}

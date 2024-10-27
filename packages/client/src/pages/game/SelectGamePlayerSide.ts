import {PatchableGame, soloLikeGameTypes} from '@doko/common';
import {useCallback} from 'react';
import {useGame, usePatchGame} from '../../store/Games';

export function useSelectGamePlayerSide(): (memberId: string, shallBeRe: boolean) => boolean {
  const game = useGame()!;
  const patchGame = usePatchGame();
  return useCallback(
    (memberId, shallBeRe) => {
      const isSoloLike = soloLikeGameTypes.includes(game.data.gameType);
      const isGameTypePlayer = game.data.gameTypeMemberId === memberId;
      const sideKey = shallBeRe ? 're' : 'contra';
      const otherSideKey = shallBeRe ? 'contra' : 're';
      const inParty = game.data[sideKey].members.includes(memberId);
      if (inParty || isGameTypePlayer) {
        return false; //nothing to do, already in party or gameType relevant player, who cannot be changed here
      }

      const gamePatch: PatchableGame = {
        data: {
          [sideKey]: {
            members: [...game.data[sideKey].members, memberId],
          },
        },
      };

      if (game.data[otherSideKey].members.includes(memberId)) {
        gamePatch.data![otherSideKey] = {members: game.data[otherSideKey].members.filter((id) => id !== memberId)};
      }

      //Move undecided players to the other party once two members are known:
      if (gamePatch.data![sideKey]!.members!.length === 2 || (isSoloLike && shallBeRe)) {
        const otherPartyMembers = new Set(game.data.players);
        gamePatch.data![sideKey]!.members!.forEach((id) => otherPartyMembers.delete(id));
        gamePatch.data![otherSideKey] = {members: [...otherPartyMembers]};
      }

      patchGame(gamePatch);
      return true;
    },
    [game, patchGame],
  );
}

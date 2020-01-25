import {
  defaultGroupSettings,
  Game,
  getDefaultGameData,
  Group,
  GroupGroupMembers,
  mergeStates,
  NIL,
  objectContains,
  PatchableGame,
  recalcPoints,
} from '@doko/common';
import {useRouteMatch} from 'react-router-dom';
import {useCallback, useEffect, useState} from 'react';

const player1 = '00000000-0000-0000-0000-000000000001';
const player2 = '00000000-0000-0000-0000-000000000002';
const player3 = '00000000-0000-0000-0000-000000000003';
const player4 = '00000000-0000-0000-0000-000000000004';

const groupMembers: GroupGroupMembers = {
  '00000000-0000-0000-0000-000000000001': {id: player1, groupId: NIL, isRegular: true, name: 'Arno'},
  '00000000-0000-0000-0000-000000000002': {id: player2, groupId: NIL, isRegular: true, name: 'Bruno'},
  '00000000-0000-0000-0000-000000000003': {id: player3, groupId: NIL, isRegular: true, name: 'Carlo'},
  '00000000-0000-0000-0000-000000000004': {id: player4, groupId: NIL, isRegular: true, name: 'Django'},
};

const group: Group = {
  id: NIL,
  name: 'Simulation',
  settings: defaultGroupSettings,
  lastRoundUnix: null,
  roundsCount: 0,
};

const gameData = getDefaultGameData(defaultGroupSettings);
let game: Game = {
  id: NIL,
  roundId: NIL,
  gameNumber: 1,
  dealerGroupMemberId: player1,
  data: {
    ...gameData,
    players: [player1, player2, player3, player4],
    isComplete: true,
  },
};

const fixPartyMembers = {data: {re: {members: [player1, player2]}, contra: {members: [player3, player4]}}};
game = mergeStates<Game>(game, fixPartyMembers);

//Initial situation - questionable point for contra:
game = mergeStates<Game>(game, {
  data: {
    re: {
      announced: player1,
      no9: player1,
      no6: player1,
      pips: '180',
    },
    contra: {pips: '60'},
  },
});

game.data = recalcPoints(game.data);

export function useSimulation(): boolean {
  const {url} = useRouteMatch();
  return /simulation/.test(url);
}

const updateTriggers = new Set<(o: object) => void>();

export function useSimulatedGame(): Game {
  const [, force] = useState();
  useEffect(() => {
    updateTriggers.add(force);
    return () => {
      updateTriggers.delete(force);
    };
  }, [force]);
  return game;
}

export function useSimulatedPatchGame(): (partial: PatchableGame) => void {
  return useCallback((partial: PatchableGame) => {
    if (!objectContains(game, partial)) {
      console.error(partial);
      game = mergeStates<Game>(game, partial);
      game = mergeStates<Game>(game, fixPartyMembers); //keep parties
      game.data = recalcPoints(game.data);
      updateTriggers.forEach((trigger) => trigger({}));
    }
  }, []);
}

export function useSimulatedGroupMembers(): GroupGroupMembers {
  return groupMembers;
}

export function useSimulatedGroup(): Group {
  return group;
}

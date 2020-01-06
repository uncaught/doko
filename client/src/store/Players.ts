import {State} from './Store';
import {
  GroupMember,
  mergeStates,
  Party,
  Player,
  Players,
  PlayerSittingOrderPatch,
  PlayersPatch,
  RoundDetailsLoaded,
  RoundsAdd,
} from '@doko/common';
import {createReducer} from 'src/store/Reducer';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useMemo} from 'react';
import {LoguxDispatch} from './Logux';
import {useFullParams} from '../Page';
import {useSortedGames} from './Games';
import {useGroupMembers} from './GroupMembers';

const {addReducer, combinedReducer} = createReducer<Players>({}, 'players');

addReducer<RoundsAdd>('rounds/add', (state, {round, players}) => ({...state, [round.id]: players}));

addReducer<RoundDetailsLoaded>('roundDetails/loaded', (state, {roundId, players}) => ({...state, [roundId]: players}));

addReducer<PlayerSittingOrderPatch>('players/patchSittingOrder', (state, {roundId, order}) => {
  const oldPlayers = state[roundId];
  if (oldPlayers) {
    const players = order.map((memberId, index) => {
      const player = oldPlayers.find(({groupMemberId}) => groupMemberId === memberId);
      if (!player) {
        throw new Error(`Missing player '${memberId}' in loaded round players`);
      }
      return {...player, sittingOrder: index + 1};
    });
    return {...state, [roundId]: players};
  }
  return state;
});

addReducer<PlayersPatch>('players/patch', (state, {roundId, groupMemberId, player}) => {
  if (state[roundId]) {
    const players = [...state[roundId]];
    const playerIdx = players.findIndex(({groupMemberId: memberId}) => groupMemberId === memberId);
    if (playerIdx > -1) {
      players[playerIdx] = mergeStates<Player>(players[playerIdx], player);
      return {...state, [roundId]: players};
    }
  }
  return state;
});

export const playersReducer = combinedReducer;

export const playersSelector = (state: State) => state.players;

const emptyPlayers: Player[] = [];

export function usePlayers(): Player[] {
  const {roundId} = useFullParams<{ roundId: string }>();
  return useSelector(playersSelector)[roundId] || emptyPlayers;
}

export function useActivePlayers(): Player[] {
  const players = usePlayers();
  return useMemo(() => players.filter((p) => p.leftAfterGameNumber !== 0), [players]);
}

interface PlayerStats {
  member: GroupMember;
  player: Player;
  euros: string;
  pointBalance: number;
  dutySoloPlayed: boolean;
}

export function usePlayersWithStats(): PlayerStats[] {
  const players = useActivePlayers();
  const games = useSortedGames();
  const members = useGroupMembers();

  return useMemo(() => {
    const statsByMember = new Map<string, PlayerStats>();

    players.forEach((player) => {
      statsByMember.set(player.groupMemberId, {
        player,
        member: members[player.groupMemberId],
        euros: '',
        pointBalance: 0,
        dutySoloPlayed: false,
      });
    });

    const addPoints = (p: Party) => {
      p.members.forEach((id) => {
        statsByMember.get(id)!.pointBalance += p.totalPoints;
      });
    };

    games.forEach(({data: {isComplete, gameType, re, contra}}) => {
      if (!isComplete) {
        //only complete games are counted for the player stats.
        return;
      }

      if (gameType === 'dutySolo' || gameType === 'forcedSolo') {
        statsByMember.get(re.members[0])!.dutySoloPlayed = true;
      }

      addPoints(re);
      addPoints(contra);
    });

    const sorted = [...statsByMember.values()].sort((a, b) => b.pointBalance - a.pointBalance);
    const topPoints = sorted.length ? sorted[0].pointBalance : 0;
    sorted.forEach((stat) => stat.euros = ((topPoints - stat.pointBalance) * 0.05).toFixed(2));
    return sorted;
  }, [games, members, players]);
}

export function usePatchSittingOrder() {
  const {roundId} = useFullParams<{ roundId: string }>();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((order: string[]) => {
    dispatch.sync<PlayerSittingOrderPatch>({
      order,
      roundId,
      type: 'players/patchSittingOrder',
    });
  }, [dispatch, roundId]);
}

export function usePatchAttendance() {
  const {roundId} = useFullParams<{ roundId: string }>();
  const dispatch = useDispatch<LoguxDispatch>();
  const players = usePlayers();
  const games = useSortedGames();
  return useCallback((groupMemberId: string) => {
    const player = players.find(({groupMemberId: memberId}) => groupMemberId === memberId);
    if (!player) {
      throw new Error(`Missing player '${groupMemberId}' in loaded round players`);
    }
    const isAttending = player.leftAfterGameNumber === null;
    const currentGameNumber = games.length ? games[games.length - 1].gameNumber : 0;
    dispatch.sync<PlayersPatch>({
      groupMemberId,
      roundId,
      player: {
        joinedAfterGameNumber: isAttending ? player.joinedAfterGameNumber : currentGameNumber,
        leftAfterGameNumber: isAttending ? currentGameNumber : null,
      },
      type: 'players/patch',
    });
  }, [dispatch, games, players, roundId]);
}

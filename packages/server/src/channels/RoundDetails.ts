import {
  GamesAdd,
  GamesPatch,
  GamesRemove,
  PlayerSittingOrderPatch,
  PlayersPatch,
  RoundDetailsLoad,
  RoundDetailsLoaded,
} from '@doko/common';
import {canReadGroup} from '../Auth';
import {createFilter} from '../logux/Filter';
import server from '../Server';
import {loadGames} from './Games';
import {loadPlayers} from './Players';
import {getGroupForRound} from './Rounds';

server.channel<RoundDetailsLoad>('roundDetails/load', {
  async access(ctx, {roundId}) {
    const groupId = await getGroupForRound(roundId);
    return groupId === null || await canReadGroup(ctx.userId!, groupId);
  },
  async init(ctx, {roundId}) {
    const groupId = await getGroupForRound(roundId);
    if (groupId !== null) { //unkown group, assume newly created
      const [games, players] = await Promise.all([loadGames(roundId), loadPlayers(roundId)]);
      await ctx.sendBack<RoundDetailsLoaded>({
        games,
        players,
        roundId,
        type: 'roundDetails/loaded',
      });
    }
  },
  filter(ctx, {roundId: subRoundId}) {
    const {addFilter, combinedFilter} = createFilter();
    addFilter<GamesAdd>('games/add', (_, {game}) => game.roundId === subRoundId);
    addFilter<GamesPatch>('games/patch', (_, {roundId}) => roundId === subRoundId);
    addFilter<GamesRemove>('games/remove', (_, {roundId}) => roundId === subRoundId);
    addFilter<PlayerSittingOrderPatch>('players/patchSittingOrder', (_, {roundId}) => roundId === subRoundId);
    addFilter<PlayersPatch>('players/patch', (_, {roundId}) => roundId === subRoundId);
    return combinedFilter;
  },
});


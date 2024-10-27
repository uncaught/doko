import {RoundResults} from '@doko/common';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSortedGames} from '../Games';
import {usePlayersWithStats} from '../Players';
import {usePatchRound, useRound} from '../Rounds';

export function useFinishRound() {
  const round = useRound();
  const patchRound = usePatchRound();
  const playersWithStats = usePlayersWithStats(true);
  const sortedGames = useSortedGames();
  const navigate = useNavigate();
  const lastGame = sortedGames[sortedGames.length - 1];
  return useCallback(
    (forcePrematureEnd = false) => {
      if (!round || !lastGame || (!lastGame.data.isLastGame && !forcePrematureEnd)) {
        return;
      }
      const results: RoundResults = {
        gamesCount: sortedGames.length,
        runsCount: lastGame.data.runNumber,
        players: {},
      };
      playersWithStats.forEach(({member, pointBalance, pointDiffToTopPlayer, statistics}) => {
        results.players[member.id] = {pointBalance, pointDiffToTopPlayer, statistics};
      });
      patchRound({
        endDate: Math.round(Date.now() / 1000),
        data: {results},
      });
      navigate(`/group/${round.groupId}/rounds`);
    },
    [navigate, lastGame, patchRound, playersWithStats, round, sortedGames.length],
  );
}

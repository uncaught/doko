import {RoundsRemove} from '@doko/common';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useSortedGames} from '../Games';
import {LoguxDispatch} from '../Logux';
import {useRound} from '../Rounds';

export function useRemoveRound() {
  const round = useRound();
  const currentGames = useSortedGames();
  const navigate = useNavigate();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((): void => {
    if (!round) {
      throw new Error(`No round`);
    }
    if (round.endDate || currentGames.length) {
      return;
    }
    dispatch.sync<RoundsRemove>({id: round.id, groupId: round.groupId, type: 'rounds/remove'});
    navigate(`/group/${round.groupId}`);
  }, [round, currentGames.length, dispatch, navigate]);
}

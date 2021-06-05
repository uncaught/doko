import {useSortedGames} from '../Games';
import {useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {LoguxDispatch} from '../Logux';
import {useCallback} from 'react';
import {RoundsRemove} from '@doko/common';
import {useRound} from '../Rounds';

export function useRemoveRound() {
  const round = useRound();
  const currentGames = useSortedGames();
  const history = useHistory();
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((): void => {
    if (!round) {
      throw new Error(`No round`);
    }
    if (round.endDate || currentGames.length) {
      return;
    }
    dispatch.sync<RoundsRemove>({id: round.id, groupId: round.groupId, type: 'rounds/remove'});
    history.push(`/group/${round.groupId}`);
  }, [round, currentGames.length, dispatch, history]);
}

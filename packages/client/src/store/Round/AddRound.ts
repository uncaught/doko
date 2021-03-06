import {useGroup} from '../Groups';
import {useDispatch} from 'react-redux';
import {LoguxDispatch} from '../Logux';
import {useGroupMembers} from '../GroupMembers';
import {useCallback, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {generateUuid, getDefaultRoundData, Player, Round, RoundsAdd} from '@doko/common';
import dayjs from 'dayjs';

export function useAddRound() {
  const {id: groupId, settings} = useGroup()!;
  const dispatch = useDispatch<LoguxDispatch>();
  const members = useGroupMembers();
  const sortedMembers = useMemo(() => Object.values(members).sort((a, b) => {
    const compareIsRegular = +b.isRegular - +a.isRegular;
    return compareIsRegular === 0 ? a.name.localeCompare(b.name) : compareIsRegular;
  }), [members]);

  const history = useHistory();
  return useCallback(() => {
    const roundId = generateUuid();
    const round: Round = {
      groupId,
      data: getDefaultRoundData(settings),
      startDate: dayjs().unix(),
      endDate: null,
      id: roundId,
    };
    const players = sortedMembers.reduce<Player[]>((acc, {id, isRegular}, idx) => {
      acc.push({
        roundId,
        groupMemberId: id,
        sittingOrder: idx + 1,
        joinedAfterGameNumber: 0,
        leftAfterGameNumber: isRegular ? null : 0,
      });
      return acc;
    }, []);
    dispatch.sync<RoundsAdd>({
      round,
      players,
      type: 'rounds/add',
    });
    history.push(`/group/${groupId}/rounds/round/${roundId}/players`);
  }, [dispatch, groupId, history, sortedMembers, settings]);
}

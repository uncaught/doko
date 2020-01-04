import {Game, Games, RoundsAdd} from '@doko/common';
import {useFullParams} from '../Page';
import {useSelector} from 'react-redux';
import {createReducer} from './Reducer';
import {State} from './Store';
import {useMemo} from 'react';

const {addReducer, combinedReducer} = createReducer<Games>({}, 'games');

addReducer<RoundsAdd>('rounds/add', (state, {round}) => ({...state, [round.id]: {}}));

export const gamesReducer = combinedReducer;

export const gamesSelector = (state: State) => state.games;

export function useSortedGames(): Game[] {
  const {roundId} = useFullParams<{ roundId: string }>();
  const games = useSelector(gamesSelector)[roundId] || {};
  return useMemo(() => Object.values(games).sort((a, b) => a.gameNumber - b.gameNumber), [games]);
}

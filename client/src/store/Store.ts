import {combineReducers} from 'redux';
import {gamesReducer as games} from './Games';
import {groupsReducer as groups} from './Groups';
import {roundsReducer as rounds} from './Rounds';
import {groupMembersReducer as groupMembers} from './GroupMembers';
import {playersReducer as players} from './Players';
import {Ui, uiReducer as ui} from './Ui';
import {Games, GroupMembers, Groups, Players, Rounds} from '@doko/common';

export interface State {
  games: Games;
  groups: Groups;
  groupMembers: GroupMembers;
  players: Players;
  rounds: Rounds;
  ui: Ui;
}

export const storeReducer = combineReducers<State>({
  games,
  groups,
  groupMembers,
  players,
  rounds,
  ui,
});

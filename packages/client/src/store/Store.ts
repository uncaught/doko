import {Games, GroupMembers, Groups, Players, Rounds} from '@doko/common';
import {combineReducers} from 'redux';
import {gamesReducer as games} from './Games';
import {groupMembersReducer as groupMembers} from './GroupMembers';
import {groupsReducer as groups} from './Groups';
import {playersReducer as players} from './Players';
import {roundsReducer as rounds} from './Rounds';
import {Ui, uiReducer as ui} from './Ui';

export interface State {
  games: Games;
  groups: Groups;
  groupMembers: GroupMembers;
  players: Players;
  rounds: Rounds;
  ui: Ui;
}

export const storeReducer = combineReducers({
  games,
  groups,
  groupMembers,
  players,
  rounds,
  ui,
});

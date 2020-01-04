import {Game} from './Games';
import {Player} from './Players';

export interface RoundDetailsLoad {
  channel: 'roundDetails/load';
  roundId: string;
}

export interface RoundDetailsLoaded {
  type: 'roundDetails/loaded';
  roundId: string;
  games: Game[];
  players: Player[];
}

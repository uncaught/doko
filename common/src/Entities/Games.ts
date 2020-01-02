import {DeepPartial} from '../Generics';
import {GameData} from './GameData';

export interface Game {
  id: string;
  gameId: string;
  gameNumber: number;
  dealerGroupMemberId: string;
  data: GameData;
}

export interface Games {
  [roundId: string]: {
    [id: string]: Game;
  };
}

export interface GamesLoad {
  channel: 'games/load';
  roundId: string;
}

export interface GamesLoaded {
  type: 'games/loaded';
  roundId: string;
  games: Game[];
}

export interface GamesAdd {
  type: 'games/add';
  game: Game;
}

export interface GamesPatch {
  type: 'games/patch';
  id: string;
  roundId: string;
  game: DeepPartial<Omit<Game, 'id' | 'roundId'>>;
}

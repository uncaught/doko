import {DeepPartial} from '../Generics';
import {GameData} from './GameData';

export interface Game {
  id: string;
  roundId: string;
  gameNumber: number;
  dealerGroupMemberId: string;
  data: GameData;
}

export type PatchableGame = DeepPartial<Pick<Game, 'data'>>;

export interface RoundGames {
  [id: string]: Game;
}

export interface Games {
  [roundId: string]: RoundGames;
}

export interface GamesAdd {
  type: 'games/add';
  game: Game;
}

export interface GamesPatch {
  type: 'games/patch';
  id: string;
  roundId: string;
  game: PatchableGame;
}

export interface GamesRemove {
  type: 'games/remove';
  id: string;
  roundId: string;
}

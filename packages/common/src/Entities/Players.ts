import {DeepPartial} from '../Generics';

export interface Player {
  roundId: string;
  groupMemberId: string;
  sittingOrder: number;
  joinedAfterGameNumber: number;
  leftAfterGameNumber: number | null;
}

export interface Players {
  [roundId: string]: Player[];
}

export interface PlayerSittingOrderPatch {
  type: 'players/patchSittingOrder';
  order: string[];
  roundId: string;
}

export interface PlayersPatch {
  type: 'players/patch';
  roundId: string;
  groupMemberId: string;
  player: DeepPartial<Pick<Player, 'joinedAfterGameNumber' | 'leftAfterGameNumber'>>;
}

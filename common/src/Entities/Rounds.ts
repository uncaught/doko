import {DeepPartial} from '../Generics';
import {Player} from './Players';

export interface Round {
  id: string;
  groupId: string;
  startDate: number; //unix
  endDate: number | null; //unix
}

export interface Rounds {
  [groupId: string]: {
    [id: string]: Round;
  };
}

export interface RoundsLoad {
  channel: 'rounds/load';
  groupId: string;
}

export interface RoundsLoaded {
  type: 'rounds/loaded';
  groupId: string;
  rounds: Round[];
}

export interface RoundsAdd {
  type: 'rounds/add';
  round: Round;
  players: Player[];
}

export interface RoundsPatch {
  type: 'rounds/patch';
  id: string;
  groupId: string;
  round: DeepPartial<Omit<Round, 'id' | 'groupId'>>;
}

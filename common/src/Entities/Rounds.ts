import {DeepPartial} from '../Generics';
import {Player} from './Players';
import {GroupSettings} from './GroupSettings';

export interface RoundData {
  bockInBockBehavior: GroupSettings['bockInBockBehavior'];
  dynamicRoundDuration: boolean;
  roundDuration: null | number; //number of runs (1 run = everyone dealt once)
}

/**
 * Settings not allowed to change during a round are copied over
 */
export function getDefaultRoundData(settings: GroupSettings): RoundData {
  return {
    bockInBockBehavior: settings.bockInBockBehavior,
    dynamicRoundDuration: settings.dynamicRoundDuration,
    roundDuration: null,
  };
}

export interface Round {
  id: string;
  groupId: string;
  startDate: number; //unix
  endDate: number | null; //unix
  data: RoundData;
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

export interface RoundsRemove {
  type: 'rounds/remove';
  id: string;
  groupId: string;
}

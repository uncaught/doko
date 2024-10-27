import {DeepPartial} from '../Generics';
import {GroupSettings} from './GroupSettings';
import {Player} from './Players';
import {Statistics} from './Statistics';

export interface RoundResults {
  gamesCount: number;
  runsCount: number;
  players: {
    [memberId: string]: {
      pointBalance: number;
      pointDiffToTopPlayer: number;
      statistics: Statistics;
    };
  };
}

export interface RoundData {
  bockInBockBehavior: GroupSettings['bockInBockBehavior'];
  dynamicRoundDuration: boolean;
  eurosPerPointDiffToTopPlayer: GroupSettings['eurosPerPointDiffToTopPlayer'];
  roundDuration: null | number; //number of runs (1 run = everyone dealt once)
  results: null | RoundResults;
}

/**
 * Settings not allowed to change during a round are copied over
 */
export function getDefaultRoundData(settings: GroupSettings): RoundData {
  return {
    bockInBockBehavior: settings.bockInBockBehavior,
    dynamicRoundDuration: settings.dynamicRoundDuration,
    eurosPerPointDiffToTopPlayer: settings.eurosPerPointDiffToTopPlayer,
    roundDuration: null,
    results: null,
  };
}

export interface Round {
  id: string;
  groupId: string;
  startDate: number; //unix
  endDate: number | null; //unix
  data: RoundData;
}

export type PatchableRound = DeepPartial<Pick<Round, 'startDate' | 'endDate' | 'data'>>;

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
  round: PatchableRound;
}

export interface RoundsRemove {
  type: 'rounds/remove';
  id: string;
  groupId: string;
}

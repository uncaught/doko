import {GroupSettings, SoloType} from './GroupSettings';
import {GameCalcLog} from '../GameCalc';

export type PipRange =
  '0'
  | '1-29'
  | '30'
  | '31-59'
  | '60'
  | '61-89'
  | '90'
  | '91-119'
  | '120'
  | '121-149'
  | '150'
  | '151-179'
  | '180'
  | '181-209'
  | '210'
  | '211-239'
  | '240';

export const pipRanges: PipRange[] = [
  '0',
  '1-29',
  '30',
  '31-59',
  '60',
  '61-89',
  '90',
  '91-119',
  '120',
  '121-149',
  '150',
  '151-179',
  '180',
  '181-209',
  '210',
  '211-239',
  '240',
];
export const reversedPipRanges = pipRanges.slice(0).reverse();

export interface ExtraPoint {
  from?: string; //e.g. fox from member x
  to: string; // e.g. caught by member y
  type: keyof GroupSettings['extraPoints'];
}

export interface Party {
  announced: string | null;
  no9: string | null;
  no6: string | null;
  no3: string | null;
  no0: string | null;
  members: string[];
  pips: PipRange;
  extraPoints: ExtraPoint[];
  totalPoints: number; //total, already multiplied times 3 for solo, negative for the losing party
}

export type Announce = 'announced' | 'no9' | 'no6' | 'no3' | 'no0';

export const announceChain: Announce[] = ['announced', 'no9', 'no6', 'no3', 'no0'];

export type GameType =
  'normal'
  | 'poverty'
  | 'wedding'
  | 'silentWedding'
  | 'dutySolo'
  | 'lustSolo'
  | 'forcedSolo'
  | 'penalty';

export const gameTypes: GameType[] = [
  'normal',
  'wedding',
  'poverty',
  'dutySolo',
  'lustSolo',
  'forcedSolo',
  'silentWedding',
  'penalty',
];
export const reDealGameTypes: GameType[] = ['dutySolo', 'penalty'];

//fulfillment of solo with:
export const soloGameTypes: GameType[] = ['dutySolo', 'lustSolo', 'forcedSolo'];

//for team building and point calculation:
export const soloLikeGameTypes: GameType[] = [...soloGameTypes, 'silentWedding', 'penalty'];

export const gameTypeTexts = new Map<GameType, string>([
  ['normal', 'Normalspiel'],
  ['wedding', 'Hochzeit'],
  ['poverty', 'Armut'],
  ['dutySolo', 'Pflichtsolo'],
  ['lustSolo', 'Lustsolo'],
  ['forcedSolo', 'Vorführung'],
  ['silentWedding', 'Stille Hochzeit'],
  ['penalty', 'Strafe'],
]);

export interface GameData {
  gameCalcLog: GameCalcLog;
  gameType: GameType;
  gameTypeMemberId: string | null; //soloist, poor guy of poverty, wedding announcer or penalty receiver
  soloType: null | SoloType; //only for regular soli, not weddings or penalties
  re: Party;
  contra: Party;
  wonAgainstQueensOfClubsExtraPoint: boolean;
  isBockGame: boolean;
  qualifiesNewBockGames: boolean;
  bockEffect: GroupSettings['bockEffect'];
  bockEffectExtraPoints: number;
  isComplete: boolean;
  gamePoints: number;
  winner: 'stalemate' | 're' | 'contra';
}

export function getDefaultParty(): Party {
  return {
    announced: null,
    no9: null,
    no6: null,
    no3: null,
    no0: null,
    members: [],
    pips: '120',
    extraPoints: [],
    totalPoints: 0,
  };
}

export function getDefaultGameData(settings: GroupSettings): GameData {
  return {
    gameCalcLog: [],
    gameType: 'normal',
    gameTypeMemberId: null,
    soloType: null,
    re: getDefaultParty(),
    contra: getDefaultParty(),
    wonAgainstQueensOfClubsExtraPoint: settings.extraPoints.wonAgainstQueensOfClubs,
    isBockGame: false,
    qualifiesNewBockGames: false,
    bockEffect: settings.bockEffect, //copied to avoid corruption after changes
    bockEffectExtraPoints: settings.bockEffectExtraPoints,
    isComplete: false,
    gamePoints: 0,
    winner: 'stalemate',
  };
}

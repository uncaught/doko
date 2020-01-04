import {GroupSettings, SoloType} from './GroupSettings';

type PipRange =
  '0'
  | '1-29'
  | '30-59'
  | '60-89'
  | '90-119'
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
  '30-59',
  '60-89',
  '90-119',
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

interface ExtraPoint {
  from?: string; //e.g. fox from member x
  to?: string; // e.g. caught by member y
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

export interface GameData {
  gameType: 'normal' | 'poverty' | 'wedding' | 'silentWedding' | 'dutySolo' | 'lustSolo' | 'forcedSolo' | 'penalty';
  soloType: null | SoloType;
  re: Party;
  contra: Party;
  isComplete: boolean;
  gamePoints: number;
  winner: 're' | 'contra';
}

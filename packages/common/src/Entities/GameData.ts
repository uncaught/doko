import {GameCalcLog} from '../GameCalc';
import {GroupSettings, SoloType} from './GroupSettings';

export type PipRange =
  | '0'
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

export const announceChain = ['announced', 'no9', 'no6', 'no3', 'no0'] as const;
export type Announce = (typeof announceChain)[number];

export const gameTypes = [
  'normal',
  'wedding',
  'poverty',
  'dutySolo',
  'lustSolo',
  'forcedSolo',
  'silentWedding',
  'soloWedding',
  'penalty',
  'manualInput',
] as const;
export type GameType = (typeof gameTypes)[number];

export const reDealGameTypes: GameType[] = ['dutySolo', 'penalty'];

//fulfillment of solo with:
export const soloGameTypes: GameType[] = ['dutySolo', 'lustSolo', 'forcedSolo'];

//for team building and point calculation:
export const soloLikeGameTypes: GameType[] = [...soloGameTypes, 'silentWedding', 'soloWedding', 'penalty'];

export const gameTypeTexts: Record<GameType, string> = {
  dutySolo: 'Pflichtsolo',
  forcedSolo: 'Vorführung',
  lustSolo: 'Lustsolo',
  manualInput: 'Manuelle Eingabe',
  normal: 'Normalspiel',
  penalty: 'Strafe',
  poverty: 'Armut',
  silentWedding: 'Stille Hochzeit',
  soloWedding: 'Solo Hochzeit',
  wedding: 'Hochzeit',
};

export interface ManualInput {
  comment: string;
  dealAgain: boolean;
  points: {player: string; points: number}[]; //array so deep-patch will replace the entire thing
}

export interface GameData {
  bockEffect: GroupSettings['bockEffect'];
  bockEffectExtraPoints: number;
  bockGameConditions: GroupSettings['bockGames'];
  bockGameWeight: number;
  contra: Party;
  gameCalcLog: GameCalcLog;
  gamePoints: number;
  gameType: GameType;
  gameTypeMemberId: string | null; //soloist, poor guy of poverty, wedding announcer or penalty receiver
  heartsTrickWentThrough: boolean;
  isComplete: boolean;
  isLastGame: boolean;
  manualInput?: ManualInput | null;
  penaltyCountsAsDutySolo?: boolean;
  players: string[];
  qualifiesNewBockGames: boolean;
  re: Party;
  runNumber: number;
  soloType: null | SoloType; //only for regular soli, not weddings or penalties
  winner: 'stalemate' | 're' | 'contra';
  wonAgainstQueensOfClubsExtraPoint: boolean;
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

/**
 * The settings required to calculate the game-state are copied over to the game to avoid conflicts with setting-changes
 */
export function getDefaultGameData(settings: GroupSettings): GameData {
  return {
    gameCalcLog: [],
    gameType: 'normal',
    gameTypeMemberId: null,
    soloType: null,
    runNumber: 0,
    isLastGame: false,
    players: [],
    re: getDefaultParty(),
    contra: getDefaultParty(),
    wonAgainstQueensOfClubsExtraPoint: settings.extraPoints.wonAgainstQueensOfClubs,
    bockGameWeight: 0,
    qualifiesNewBockGames: false,
    bockEffect: settings.bockEffect,
    bockEffectExtraPoints: settings.bockEffectExtraPoints,
    bockGameConditions: settings.bockGames,
    heartsTrickWentThrough: false,
    isComplete: false,
    gamePoints: 0,
    winner: 'stalemate',
  };
}

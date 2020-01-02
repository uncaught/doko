import {SoloType} from './GroupSettings';

export interface GameData {
  gameType: 'normal' | 'poverty' | 'wedding' | 'silentWedding' | 'dutySolo' | 'lustSolo' | 'forcedSolo' | 'penalty';
  soloType: null | SoloType;
}

export const defaultGameData: GameData = {
  gameType: 'normal',
  soloType: null,
};

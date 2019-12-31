export type SoloType =
  'trump'
  | 'queens'
  | 'jacks'
  | 'kings'
  | 'cross'
  | 'spades'
  | 'hearts'
  | 'diamonds'
  | 'fleshless';

export const soloTypes = new Map<SoloType, string>([
  ['trump', 'Trumpf'],
  ['queens', 'Damen'],
  ['jacks', 'Buben'],
  ['kings', 'Könige'],
  ['cross', 'Kreuz'],
  ['spades', 'Pick'],
  ['hearts', 'Herz'],
  ['diamonds', 'Karo'],
  ['fleshless', 'Fleischlos'],
]);

export const soloOptions = [...soloTypes].reduce<{ text: string; value: SoloType }[]>((acc, [value, text]) => {
  acc.push({text, value});
  return acc;
}, []);

export interface GameData {
  gameType: 'normal' | 'poverty' | 'wedding' | 'silentWedding' | 'dutySolo' | 'lustSolo' | 'forcedSolo' | 'penalty';
  soloType: null | SoloType;
}

export const defaultGameData: GameData = {
  gameType: 'normal',
  soloType: null,
};

export interface GroupSettings {
  allowedSoloTypes: SoloType[];
  extraPoints: {
    wonAgainstRe: boolean; //only applies to game types `normal` and `wedding`
    doppelkopf: boolean;
    foxCaught: boolean;
    karlGotLastTrick: boolean;
    karlCaught: boolean;
  };
  bockGames: {
    heartsTrick: boolean;
    bothParties120Points: boolean;
    zeroGame: boolean;
    rePartyLostWithAnnounce: boolean;
    contraPartyLostWithAnnounce: boolean;
    soloLost: boolean;
  };
}

export const defaultGroupSettings: GroupSettings = {
  allowedSoloTypes: ['trump', 'queens', 'jacks', 'cross', 'spades', 'hearts', 'diamonds', 'fleshless'],
  extraPoints: {
    wonAgainstRe: true,
    doppelkopf: true,
    foxCaught: true,
    karlGotLastTrick: true,
    karlCaught: false,
  },
  bockGames: {
    heartsTrick: false,
    bothParties120Points: false,
    zeroGame: false,
    rePartyLostWithAnnounce: false,
    contraPartyLostWithAnnounce: false,
    soloLost: false,
  },
};

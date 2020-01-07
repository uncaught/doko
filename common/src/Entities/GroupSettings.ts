export type SoloType =
  'trump' //also known as 'diamonds'
  | 'queens'
  | 'jacks'
  | 'kings'
  | 'clubs'
  | 'spades'
  | 'hearts'
  | 'fleshless';

function mapToOptions(map: Map<string, string>): { text: string; value: string }[] {
  return [...map].reduce<{ text: string; value: string }[]>((acc, [value, text]) => {
    acc.push({text, value});
    return acc;
  }, []);
}

export const soloTypeTexts = new Map<SoloType, string>([
  ['queens', 'Damen'],
  ['jacks', 'Buben'],
  ['kings', 'Könige'],
  ['trump', 'Trumpf'],
  ['clubs', 'Kreuz'],
  ['spades', 'Pick'],
  ['hearts', 'Herz'],
  ['fleshless', 'Fleischlos'],
]);

export const soloTypeOptions = mapToOptions(soloTypeTexts);

export interface GroupSettings {
  allowedSoloTypes: SoloType[];
  extraPoints: {
    wonAgainstQueensOfClubs: boolean; //only applies to game types `normal` and `wedding`
    doppelkopf: boolean;
    foxCaught: boolean;
    karlGotLastTrick: boolean;
    karlCaught: boolean;
  };
  bockEffect: 'extraPoints' | 'doubleGamePoints' | 'doubleGameAndExtraPoints';
  bockEffectExtraPoints: number;
  bockInBockBehavior: 'ignored' | 'stack' | 'extend' | 'restart';
  bockGames: {
    heartsTrick: boolean;
    bothParties120Points: boolean;
    zeroGame: boolean;
    rePartyLostWithAnnounce: boolean;
    contraPartyLostWithAnnounce: boolean;
    soloLost: boolean;
  };
}

export const extraPointsTranslations = new Map<keyof GroupSettings['extraPoints'], string>([
  ['wonAgainstQueensOfClubs', 'Gegen die Alten gewinnen'],
  ['doppelkopf', 'Doppelkopf'],
  ['foxCaught', 'Fuchs fangen'],
  ['karlGotLastTrick', 'Karlchen macht den letzten Stich'],
  ['karlCaught', 'Karlchen im letzten Stich fangen'],
]);

export const bockGamesTranslations = new Map<keyof GroupSettings['bockGames'], string>([
  ['heartsTrick', 'Herzstich geht durch'],
  ['bothParties120Points', 'Beide Parteien haben 120 Punkte'],
  ['zeroGame', 'Nullspiel'],
  ['rePartyLostWithAnnounce', 'Re verliert trotz Ansage'],
  ['contraPartyLostWithAnnounce', 'Contra verliert trotz Ansage'],
  ['soloLost', 'Solo-Spieler verliert'],
]);

export const bockInBockBehaviorOptions = new Map<GroupSettings['bockInBockBehavior'], string>([
  ['ignored', 'Ignorieren'],
  ['stack', 'Effekt stapeln'],
  ['extend', 'Dauer verlängern'],
  ['restart', 'Neustarten'],
]);

export const bockEffectTexts = new Map<GroupSettings['bockEffect'], string>([
  ['extraPoints', 'Sonderpunkte'],
  ['doubleGamePoints', 'Verdopplung der Spielpunkte'],
  ['doubleGameAndExtraPoints', 'Verdopplung der Spiel- und Sonderpunkte'],
]);

export const bockEffectOptions = mapToOptions(bockEffectTexts);

export const defaultGroupSettings: GroupSettings = {
  allowedSoloTypes: ['trump', 'queens', 'jacks', 'clubs', 'spades', 'hearts', 'fleshless'],
  extraPoints: {
    wonAgainstQueensOfClubs: true,
    doppelkopf: true,
    foxCaught: true,
    karlGotLastTrick: true,
    karlCaught: false,
  },
  bockEffect: 'doubleGameAndExtraPoints',
  bockEffectExtraPoints: 2,
  bockInBockBehavior: 'stack',
  bockGames: {
    heartsTrick: false,
    bothParties120Points: false,
    zeroGame: false,
    rePartyLostWithAnnounce: false,
    contraPartyLostWithAnnounce: false,
    soloLost: false,
  },
};

import {SubType} from '../Generics';
import {ucfirst} from '../Ucfirst';
import {GameData, Party, soloGameTypes, soloLikeGameTypes} from './GameData';

export interface ExtraPoints {
  doppelkopf: number;
  foxCaught: number;
  foxLost: number;
  karlCaught: number;
  karlGotLastTrick: number;
  karlLost: number;
  wonAgainstQueensOfClubs: number;
}

export interface GameTypes {
  total: number;
  normal: number;
  penalty: number;
  penaltyOpponent: number;
  poverty: number;
  povertyPartner: number;
  povertyOpponent: number;
  wedding: number;
  weddingPartner: number;
  weddingOpponent: number;
  silentWedding: number;
  silentWeddingOpponent: number;
  soloWedding: number;
  soloWeddingOpponent: number;
  dutySolo: number;
  lustSolo: number;
  forcedSolo: number;
  soloOpponent: number;
}

export interface SoloTypes {
  trump: number;
  queens: number;
  jacks: number;
  kings: number;
  clubs: number;
  spades: number;
  hearts: number;
  fleshless: number;
}

export interface Announces {
  announcedRe: number;
  announcedContra: number;
  no9Re: number;
  no9Contra: number;
  no6Re: number;
  no6Contra: number;
  no3Re: number;
  no3Contra: number;
  no0Re: number;
  no0Contra: number;
}

export interface MissedAnnounces {
  notAnnouncedBut121: number;
  notAnnouncedBut151: number;
  notAnnouncedBut181: number;
  notAnnouncedBut211: number;
  notAnnouncedBut240: number;
  notNo9But151: number;
  notNo9But181: number;
  notNo9But211: number;
  notNo9But240: number;
  notNo6But181: number;
  notNo6But211: number;
  notNo6But240: number;
  notNo3But211: number;
  notNo3But240: number;
  notNo0But240: number;
}

export interface Statistics {
  announces: Announces;
  announcesWon: Announces;
  extraPoints: ExtraPoints;
  gameTypes: GameTypes;
  gameTypesWon: GameTypes;
  missedAnnounces: MissedAnnounces;
  soloTypes: SoloTypes;
  soloTypesWon: SoloTypes;
}

function createAnnounces(): Announces {
  return {
    announcedContra: 0,
    announcedRe: 0,
    no9Contra: 0,
    no9Re: 0,
    no6Contra: 0,
    no6Re: 0,
    no3Contra: 0,
    no3Re: 0,
    no0Contra: 0,
    no0Re: 0,
  };
}

function createExtraPoints(): ExtraPoints {
  return {
    doppelkopf: 0,
    foxCaught: 0,
    foxLost: 0,
    karlCaught: 0,
    karlGotLastTrick: 0,
    karlLost: 0,
    wonAgainstQueensOfClubs: 0,
  };
}

function createGameTypes(): GameTypes {
  return {
    total: 0,
    normal: 0,
    penalty: 0,
    penaltyOpponent: 0,
    poverty: 0,
    povertyPartner: 0,
    povertyOpponent: 0,
    wedding: 0,
    weddingPartner: 0,
    weddingOpponent: 0,
    silentWedding: 0,
    silentWeddingOpponent: 0,
    soloWedding: 0,
    soloWeddingOpponent: 0,
    dutySolo: 0,
    lustSolo: 0,
    forcedSolo: 0,
    soloOpponent: 0,
  };
}

function createSoloTypes(): SoloTypes {
  return {
    trump: 0,
    queens: 0,
    jacks: 0,
    kings: 0,
    clubs: 0,
    spades: 0,
    hearts: 0,
    fleshless: 0,
  };
}

function createMissedAnnounces(): MissedAnnounces {
  return {
    notAnnouncedBut121: 0,
    notAnnouncedBut151: 0,
    notAnnouncedBut181: 0,
    notAnnouncedBut211: 0,
    notAnnouncedBut240: 0,
    notNo9But151: 0,
    notNo9But181: 0,
    notNo9But211: 0,
    notNo9But240: 0,
    notNo6But181: 0,
    notNo6But211: 0,
    notNo6But240: 0,
    notNo3But211: 0,
    notNo3But240: 0,
    notNo0But240: 0,
  };
}

export function createStatistics(): Statistics {
  return {
    announces: createAnnounces(),
    announcesWon: createAnnounces(),
    extraPoints: createExtraPoints(),
    gameTypes: createGameTypes(),
    gameTypesWon: createGameTypes(),
    missedAnnounces: createMissedAnnounces(),
    soloTypes: createSoloTypes(),
    soloTypesWon: createSoloTypes(),
  };
}

export function addStatistics(target: Statistics, source: Statistics): void {
  const topKeys = Object.keys(target) as Array<keyof Statistics>;
  topKeys.forEach((topKey) => {
    Object.keys(target[topKey]).forEach((subKey) => {
      // @ts-ignore
      target[topKey][subKey] += source[topKey][subKey];
    });
  });
}

export type StatsMap = Map<string, {statistics: Statistics}>;

function addGameAndSoloTypes(data: GameData, statsByMember: StatsMap) {
  function addTotalAndNormalGames(key: keyof SubType<Statistics, GameTypes>) {
    return (pId: string) => {
      const {statistics} = statsByMember.get(pId)!;
      statistics[key].total++;
      if (data.gameType === 'normal') {
        statistics[key].normal++;
      }
    };
  }

  data.players.forEach(addTotalAndNormalGames('gameTypes'));
  if (data.winner !== 'stalemate') {
    data[data.winner].members.forEach(addTotalAndNormalGames('gameTypesWon'));
  }

  const reWon = data.winner === 're';

  const gameTypePlayerStats = data.gameTypeMemberId && statsByMember.get(data.gameTypeMemberId)!.statistics;
  if (gameTypePlayerStats) {
    gameTypePlayerStats.gameTypes[data.gameType]++;
    if (reWon) {
      gameTypePlayerStats.gameTypesWon[data.gameType]++;
    }

    if (soloGameTypes.includes(data.gameType) && data.soloType) {
      gameTypePlayerStats.soloTypes[data.soloType]++;
      if (reWon) {
        gameTypePlayerStats.soloTypesWon[data.soloType]++;
      }
      data.contra.members.forEach((opponentId) => {
        const opponentStats = statsByMember.get(opponentId)!.statistics;
        opponentStats.gameTypes.soloOpponent++;
        if (!reWon) {
          opponentStats.gameTypesWon.soloOpponent++;
        }
      });
    }

    if (['poverty', 'wedding'].includes(data.gameType)) {
      const partnerId = data.re.members.find((mId) => mId !== data.gameTypeMemberId)!;
      const partnerStats = statsByMember.get(partnerId)!.statistics;
      partnerStats.gameTypes[`${data.gameType}Partner` as keyof GameTypes]++;
      if (reWon) {
        partnerStats.gameTypesWon[`${data.gameType}Partner` as keyof GameTypes]++;
      }
    }

    if (['penalty', 'poverty', 'wedding', 'silentWedding', 'soloWedding'].includes(data.gameType)) {
      data.contra.members.forEach((opponentId) => {
        const opponentStats = statsByMember.get(opponentId)!.statistics;
        opponentStats.gameTypes[`${data.gameType}Opponent` as keyof GameTypes]++;
        if (!reWon) {
          opponentStats.gameTypesWon[`${data.gameType}Opponent` as keyof GameTypes]++;
        }
      });
    }
  }
}

function addAnnounces(data: GameData, statsByMember: StatsMap) {
  type PartyAnnounces = Pick<Party, 'announced' | 'no9' | 'no6' | 'no3' | 'no0'>;
  type AnnounceKey = keyof PartyAnnounces;
  const announceKeys: AnnounceKey[] = ['announced', 'no9', 'no6', 'no3', 'no0'];

  function addAnnouncesForParty(partyKey: 're' | 'contra') {
    announceKeys.forEach((key) => {
      const announcerId = data[partyKey][key];
      if (announcerId) {
        const {statistics} = statsByMember.get(announcerId)!;
        const field = `${key}${ucfirst(partyKey)}` as keyof Announces;
        statistics.announces[field]++;
        if (data.winner === partyKey) {
          statistics.announcesWon[field]++;
        }
      }
    });
  }

  addAnnouncesForParty('re');
  addAnnouncesForParty('contra');
}

function addMissedAnnounces(data: GameData, statsByMember: StatsMap) {
  if (data.winner === 'stalemate') {
    return;
  }
  const party = data[data.winner];
  const minPips = +party.pips.split('-')[0]!;

  function add(key: keyof MissedAnnounces) {
    party.members.forEach((mId) => {
      statsByMember.get(mId)!.statistics.missedAnnounces[key]++;
    });
  }

  if (!party.announced) {
    // noinspection FallThroughInSwitchStatementJS
    switch (minPips) {
      case 240:
        add('notAnnouncedBut240');
      case 211:
        add('notAnnouncedBut211');
      case 210:
      case 181:
        add('notAnnouncedBut181');
      case 180:
      case 151:
        add('notAnnouncedBut151');
      case 150:
      case 121:
        add('notAnnouncedBut121');
    }
  }
  if (!party.no9) {
    // noinspection FallThroughInSwitchStatementJS
    switch (minPips) {
      case 240:
        add('notNo9But240');
      case 211:
        add('notNo9But211');
      case 210:
      case 181:
        add('notNo9But181');
      case 180:
      case 151:
        add('notNo9But151');
    }
  }
  if (!party.no6) {
    // noinspection FallThroughInSwitchStatementJS
    switch (minPips) {
      case 240:
        add('notNo6But240');
      case 211:
        add('notNo6But211');
      case 210:
      case 181:
        add('notNo6But181');
    }
  }
  if (!party.no3) {
    // noinspection FallThroughInSwitchStatementJS
    switch (minPips) {
      case 240:
        add('notNo3But240');
      case 211:
        add('notNo3But211');
    }
  }
  if (!party.no0 && minPips === 240) {
    add('notNo0But240');
  }
}

function addExtraPoints(data: GameData, statsByMember: StatsMap) {
  function addExtraPointsForParty(party: Party) {
    party.extraPoints.forEach(({from, to, type}) => {
      statsByMember.get(to)!.statistics.extraPoints[type]++;
      if (type === 'foxCaught' && from) {
        statsByMember.get(from)!.statistics.extraPoints.foxLost++;
      }
      if (type === 'karlCaught' && from) {
        statsByMember.get(from)!.statistics.extraPoints.karlLost++;
      }
    });
  }

  addExtraPointsForParty(data.re);
  addExtraPointsForParty(data.contra);

  if (
    data.winner === 'contra' &&
    data.wonAgainstQueensOfClubsExtraPoint &&
    !soloLikeGameTypes.includes(data.gameType)
  ) {
    data.contra.members.forEach((id) => {
      statsByMember.get(id)!.statistics.extraPoints.wonAgainstQueensOfClubs++;
    });
  }
}

export function addGameToStats(data: GameData, statsByMember: StatsMap) {
  addGameAndSoloTypes(data, statsByMember);
  addAnnounces(data, statsByMember);
  addMissedAnnounces(data, statsByMember);
  addExtraPoints(data, statsByMember);
}

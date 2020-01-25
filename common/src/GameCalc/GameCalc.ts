import {GameData, Party, soloLikeGameTypes} from '../Entities';
import {mergeStates} from '../MergeStates';
import {reHasWon} from './ReHasWon';
import {GameCalcLog, GameCalcLogKey} from './GameCalcLog';
import {contraHasWon} from './ContraHasWon';

function penalty(data: GameData): GameData {
  return mergeStates<GameData>(data, {
    re: {
      totalPoints: -data.gamePoints * data.contra.members.length,
    },
    contra: {
      totalPoints: data.gamePoints,
    },
  });
}

interface AddingFn {
  (p: number): void;
}

function addPointsForPips(log: GameCalcLog, minPips: number, add: AddingFn, prefix: 're' | 'contra'): void {
  if (minPips >= 151) {
    add(1);
    log.push(`${prefix}_min_151` as GameCalcLogKey);
  }
  if (minPips >= 181) {
    add(1);
    log.push(`${prefix}_min_181` as GameCalcLogKey);
  }
  if (minPips >= 211) {
    add(1);
    log.push(`${prefix}_min_211` as GameCalcLogKey);
  }
  if (minPips >= 240) {
    add(1);
    log.push(`${prefix}_min_240` as GameCalcLogKey);
  }
}

function addPointsAgainstRejection(
  log: GameCalcLog,
  minPips: number,
  add: AddingFn,
  prefix: 're' | 'contra',
  otherParty: Party,
): void {
  if (minPips >= 120 && otherParty.no9) {
    add(1);
    log.push(`${prefix}_120_against_no9` as GameCalcLogKey);
  }
  if (minPips >= 90 && otherParty.no6) {
    add(1);
    log.push(`${prefix}_90_against_no6` as GameCalcLogKey);
  }
  if (minPips >= 60 && otherParty.no3) {
    add(1);
    log.push(`${prefix}_60_against_no3` as GameCalcLogKey);
  }
  if (minPips >= 30 && otherParty.no0) {
    add(1);
    log.push(`${prefix}_30_against_no0` as GameCalcLogKey);
  }
}

function addPointsForRejectionParty(log: GameCalcLog, party: Party, add: AddingFn, prefix: 're' | 'contra'): void {
  if (party.no9) {
    add(1);
    log.push(`${prefix}_no9` as GameCalcLogKey);
  }
  if (party.no6) {
    add(1);
    log.push(`${prefix}_no6` as GameCalcLogKey);
  }
  if (party.no3) {
    add(1);
    log.push(`${prefix}_no3` as GameCalcLogKey);
  }
  if (party.no0) {
    add(1);
    log.push(`${prefix}_no0` as GameCalcLogKey);
  }
}

function addPointsForRejection(log: GameCalcLog, data: GameData, add: AddingFn): void {
  addPointsForRejectionParty(log, data.re, add, 're'); //7.2.2 (c)
  addPointsForRejectionParty(log, data.contra, add, 'contra'); //7.2.2 (d)
}

function addPointsForAnnounces(log: GameCalcLog, data: GameData, add: AddingFn): void {
  if (data.re.announced) {
    add(2);
    log.push('re_announced');
  }
  if (data.contra.announced) {
    add(2);
    log.push('contra_announced');
  }
}

function addExtraPoints(log: GameCalcLog, party: Party, add: AddingFn, prefix: 're' | 'contra'): void {
  party.extraPoints.forEach(({type}) => {
    add(1);
    log.push(`${prefix}_extra_point_${type}` as GameCalcLogKey);
  });
}

function game(data: GameData): GameData {
  const log: GameCalcLog = [];
  const isSoloLike = soloLikeGameTypes.includes(data.gameType);

  //Get the relevant minimal pips:
  const reMinPips = +data.re.pips.split('-')[0];
  const contraMinPips = +data.contra.pips.split('-')[0];

  //Determine the winner:
  const reWon = reHasWon(data, log, reMinPips);
  const contraWon = !reWon && contraHasWon(data, log, contraMinPips);
  const hasWinner = reWon || contraWon;
  if (!hasWinner) {
    log.push('no_party_won');
  }

  let rePoints = 0;
  let contraPoints = 0;
  const addRe: AddingFn = (p) => {
    rePoints += p;
    contraPoints -= p;
  };

  const addContra: AddingFn = (p) => {
    rePoints -= p;
    contraPoints += p;
  };

  if (reWon) {
    addRe(1); //7.2.2 (a.1)
    addPointsForAnnounces(log, data, addRe); //7.2.2 (b)
    addPointsForRejection(log, data, addRe); //7.2.2 (c/d)
    addPointsForPips(log, reMinPips, addRe, 're'); //7.2.2 (a.2-5)
    addPointsForPips(log, contraMinPips, addRe, 'contra'); //7.2.2 (a.2-5)
  } else if (contraWon) {
    addContra(1); //7.2.2 (a.1)
    addPointsForAnnounces(log, data, addContra); //7.2.2 (b)
    addPointsForRejection(log, data, addContra); //7.2.2 (c/d)
    addPointsForPips(log, reMinPips, addContra, 're'); //7.2.2 (a.2-5)
    addPointsForPips(log, contraMinPips, addContra, 'contra'); //7.2.2 (a.2-5)
  } else {
    //Stalemate - no winner
    addPointsForPips(log, reMinPips, addRe, 're'); //7.2.2 (a.2-5)
    addPointsForPips(log, contraMinPips, addContra, 'contra'); //7.2.2 (a.2-5)
  }

  addPointsAgainstRejection(log, reMinPips, addRe, 're', data.contra); //7.2.2 (e)
  addPointsAgainstRejection(log, contraMinPips, addContra, 'contra', data.re); //7.2.2 (f)

  if (hasWinner && data.bockGameWeight && data.bockEffect === 'doubleGamePoints') {
    for (let i = 0; i < data.bockGameWeight; i++) {
      rePoints *= 2;
      contraPoints *= 2;
      log.push('bock_double_game_points');
    }
  }

  //Extra points (7.2.3):
  if (!isSoloLike) {
    if (contraWon && data.gameType !== 'poverty' && data.wonAgainstQueensOfClubsExtraPoint) {
      addContra(1);
      log.push('contra_extra_point_wonAgainstQueensOfClubs');
    }
    addExtraPoints(log, data.re, addRe, 're');
    addExtraPoints(log, data.contra, addContra, 'contra');
  }

  if (hasWinner && data.bockGameWeight) {
    for (let i = 0; i < data.bockGameWeight; i++) {
      if (data.bockEffect === 'doubleGameAndExtraPoints') {
        rePoints *= 2;
        contraPoints *= 2;
        log.push('bock_double_game_and_extra_points');
      } else if (data.bockEffect === 'extraPoints') {
        if (reWon) {
          addRe(data.bockEffectExtraPoints);
        } else {
          addContra(data.bockEffectExtraPoints);
        }
        log.push('bock_extra_points');
      }
    }
  }

  const qualifiesNewBockGames = (data.bockGameConditions.heartsTrick && data.heartsTrickWentThrough)
    || (data.bockGameConditions.bothParties120Points && data.re.pips === '120')
    || (data.bockGameConditions.zeroGame && contraPoints === 0)
    || (data.bockGameConditions.rePartyLostWithAnnounce && contraWon && !!data.re.announced)
    || (data.bockGameConditions.contraPartyLostWithAnnounce && reWon && !!data.contra.announced)
    || (data.bockGameConditions.soloLost && contraWon && isSoloLike);

  if (qualifiesNewBockGames) {
    log.push('qualifies_new_bock_games');
  }

  return mergeStates<GameData>(data, {
    qualifiesNewBockGames,
    gameCalcLog: log,
    re: {
      totalPoints: rePoints * (isSoloLike ? 3 : 1),
    },
    contra: {
      totalPoints: contraPoints,
    },
    gamePoints: Math.abs(contraPoints),
    winner: hasWinner ? (reWon ? 're' : 'contra') : 'stalemate',
  });
}

export function recalcPoints(data: GameData): GameData {
  if (data.isComplete) {
    if (data.gameType === 'penalty') {
      return penalty(data);
    }
    return game(data);
  }
  return data;
}

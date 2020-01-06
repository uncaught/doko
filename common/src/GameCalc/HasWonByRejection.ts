import {Party} from '../Entities';
import {GameCalcLog, GameCalcLogKey} from './GameCalcLog';

export function hasWonByRejection(
  myParty: Party,
  otherParty: Party,
  log: GameCalcLog,
  minPips: number,
  prefix: 're' | 'contra',
): boolean | null {
  if (myParty.no0) {
    if (minPips >= 240) {
      log.push(`${prefix}_won_with_240_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  if (myParty.no3) {
    if (minPips >= 211) {
      log.push(`${prefix}_won_with_211_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  if (myParty.no6) {
    if (minPips >= 181) {
      log.push(`${prefix}_won_with_181_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  if (myParty.no9) {
    if (minPips >= 151) {
      log.push(`${prefix}_won_with_151_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  if (otherParty.no0) {
    if (minPips >= 1) {
      log.push(`${prefix}_won_with_1_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  if (otherParty.no3) {
    if (minPips >= 30) {
      log.push(`${prefix}_won_with_30_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  if (otherParty.no6) {
    if (minPips >= 60) {
      log.push(`${prefix}_won_with_60_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  if (otherParty.no9) {
    if (minPips >= 90) {
      log.push(`${prefix}_won_with_90_points` as GameCalcLogKey);
      return true;
    }
    return false;
  }

  return null;
}

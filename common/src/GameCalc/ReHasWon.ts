import {GameData} from '../Entities';
import {GameCalcLog} from './GameCalcLog';
import {hasWonByRejection} from './HasWonByRejection';

export function reHasWon({re, contra}: GameData, log: GameCalcLog, minPips: number): boolean {
  const wonByRejection = hasWonByRejection(re, contra, log, minPips, 're');
  if (typeof wonByRejection === 'boolean') {
    return wonByRejection;
  }

  if (!re.announced && contra.announced) {
    if (minPips >= 120) {
      log.push('re_won_with_120_points');
      return true;
    }
    return false;
  }

  if (minPips >= 121) {
    log.push('re_won_with_121_points');
    return true;
  }

  return false;
}

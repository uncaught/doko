import {GameData} from '../Entities';
import {GameCalcLog} from './GameCalcLog';
import {hasWonByRejection} from './HasWonByRejection';

export function contraHasWon({re, contra}: GameData, log: GameCalcLog, minPips: number): boolean {
  const wonByRejection = hasWonByRejection(contra, re, log, minPips, 'contra');
  if (typeof wonByRejection === 'boolean') {
    return wonByRejection;
  }

  if (!re.announced && contra.announced) {
    if (minPips >= 121) {
      log.push('contra_won_with_121_points');
      return true;
    }
    return false;
  }

  if (minPips >= 120) {
    log.push('contra_won_with_120_points');
    return true;
  }

  return false;
}

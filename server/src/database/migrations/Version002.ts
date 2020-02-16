import {query} from '../../Connection';
import {recalcRoundPlayerStatistics} from './RecalcRoundStatistics';

export async function run(update: typeof query) {
  console.log(`Running 002 ...`);
  await recalcRoundPlayerStatistics(update);
}

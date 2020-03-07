import {query} from '../../Connection';
import {recalcRoundPlayerStatistics} from './RecalcRoundStatistics';

async function fixSoloWedding(update: typeof query) {
  const gameId = '516a0e85-978f-4585-9c56-dddfc9403d32';
  console.log(`Setting game '${gameId}' to game type 'soloWedding' ...`);
  await update(`update games set data = json_replace(data, '$.gameType', 'soloWedding') where id = ?`, [gameId]);
}

export async function run(update: typeof query) {
  console.log(`Running 003 ...`);
  await fixSoloWedding(update);
  await recalcRoundPlayerStatistics(update);
}

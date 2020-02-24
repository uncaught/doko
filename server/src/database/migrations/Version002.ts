import {query} from '../../Connection';
import {recalcRoundPlayerStatistics} from './RecalcRoundStatistics';

async function fixForcedSoloMissesGameTypeMemberId(update: typeof query) {
  await update(`update games 
set data = json_replace(data, '$.gameTypeMemberId', JSON_UNQUOTE(JSON_EXTRACT(data, '$.re.members[0]')))
where JSON_UNQUOTE(JSON_EXTRACT(data, '$.gameType')) IN ('dutySolo', 'lustSolo', 'forcedSolo', 'silentWedding', 'penalty')
AND JSON_EXTRACT(data, '$.gameTypeMemberId') = 'null'`);
}

export async function run(update: typeof query) {
  console.log(`Running 002 ...`);
  await fixForcedSoloMissesGameTypeMemberId(update);
  await recalcRoundPlayerStatistics(update);
}

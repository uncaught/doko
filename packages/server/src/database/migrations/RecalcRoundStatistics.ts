import {query} from '../../Connection';
import {GameData, RoundData} from '@doko/common';
import {addGameToStats, createStatistics, StatsMap} from '@doko/common/src/Entities/Statistics';

export async function recalcRoundPlayerStatistics(update: typeof query) {
  const roundRows = await update<{id: string; data: RoundData}>('SELECT id, data FROM rounds');
  for (const roundRow of roundRows) {
    console.log(`Rewriting statistics for round ${roundRow.id} ...`);
    const data = roundRow.data;
    if (data.results) {
      const statsByMember: StatsMap = new Map();

      Object.entries(data.results.players).forEach(([memberId, player]) => {
        player.statistics = createStatistics();
        statsByMember.set(memberId, player);
      });

      const gameRows = await update<{data: GameData}>(
        'SELECT data FROM games WHERE round_id = ? ORDER BY game_number DESC', [roundRow.id]);
      gameRows.forEach((gameRow) => {
        addGameToStats(gameRow.data, statsByMember);
      });
    }
    await update('UPDATE rounds SET data = ? WHERE id = ?', [data, roundRow.id]);
  }
}

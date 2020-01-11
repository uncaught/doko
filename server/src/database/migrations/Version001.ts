import {query} from '../../Connection';
import {GameData} from '@doko/common';

export async function run(update: typeof query) {
  console.log(`Running 001 ...`);
  const rows = await update<{ id: string; data: string }>('SELECT id, data FROM games');
  for (const row of rows) {
    console.log(`Adding data.players for game ${row.id} ...`);
    const data = JSON.parse(row.data) as GameData;
    data.players = [...data.re.members, ...data.contra.members];
    const json = JSON.stringify(data);
    await update('UPDATE games SET data = ? WHERE id = ?', [json, row.id]);
  }
}

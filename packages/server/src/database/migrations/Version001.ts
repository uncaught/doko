import {GameData, GroupSettings, Party, RoundData} from '@doko/common';
import {query} from '../../Connection';

async function migrateGroups(update: typeof query) {
  const rows = await update<{id: string; settings: GroupSettings}>('SELECT id, settings FROM `groups`');
  for (const row of rows) {
    console.log(`Adding settings.eurosPerPointDiffToTopPlayer for group ${row.id} ...`);
    row.settings.eurosPerPointDiffToTopPlayer = 0.05;
    await update('UPDATE `groups` SET settings = ? WHERE id = ?', [row.settings, row.id]);
  }
}

async function getRoundGames(update: typeof query, roundId: string): Promise<GameData[]> {
  const rows = await update<{data: GameData}>(
    'SELECT data FROM games WHERE round_id = ? ORDER BY game_number DESC', [roundId]);
  return rows.map(({data}) => data);
}

async function migrateRounds(update: typeof query) {
  const rows = await update<{id: string; data: RoundData; end: number}>(
    'SELECT id, data, UNIX_TIMESTAMP(end_date) as end FROM rounds');
  for (const row of rows) {
    console.log(`Adding results for round ${row.id} ...`);

    const data = row.data;
    data.eurosPerPointDiffToTopPlayer = 0.05;

    if (row.end) {
      const gameDatas = await getRoundGames(update, row.id);
      data.results = {
        gamesCount: gameDatas.length,
        runsCount: gameDatas[0].runNumber,
        players: {},
      };
      const addPoints = (p: Party) => {
        p.members.forEach((id) => {
          if (!data.results!.players[id]) {
            // @ts-ignore
            data.results!.players[id] = {
              pointBalance: 0,
              pointDiffToTopPlayer: 0,
            };
          }
          data.results!.players[id].pointBalance += p.totalPoints;
        });
      };
      gameDatas.forEach(({re, contra}) => {
        addPoints(re);
        addPoints(contra);
      });
      const sorted = Object.values(data.results!.players).sort((a, b) => b.pointBalance - a.pointBalance);
      const topPoints = sorted.length ? sorted[0].pointBalance : 0;
      sorted.forEach((stat) => {
        stat.pointDiffToTopPlayer = topPoints - stat.pointBalance;
      });
    } else {
      data.results = null;
    }
    await update('UPDATE rounds SET data = ? WHERE id = ?', [data, row.id]);
  }
}

async function migrateGames(update: typeof query) {
  const rows = await update<{id: string; data: GameData}>('SELECT id, data FROM games');
  for (const row of rows) {
    console.log(`Adding data.players for game ${row.id} ...`);
    const data = row.data;
    data.players = [...data.re.members, ...data.contra.members];
    await update('UPDATE games SET data = ? WHERE id = ?', [data, row.id]);
  }
}

export async function run(update: typeof query) {
  console.log(`Running 001 ...`);
  await migrateGroups(update);
  await migrateRounds(update);
  await migrateGames(update);
}

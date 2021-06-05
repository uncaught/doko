import _fs from 'fs';
import {getTransactional, query} from '../../Connection';

const fs = _fs.promises;

const regex = /Version\d{3}/;

async function loadMigrations(): Promise<Set<string>> {
  try {
    const rows = await query<{ version: string }>('SELECT version FROM versions');
    return new Set(rows.map(({version}) => version));
  } catch (e) {
    await query(`CREATE TABLE versions (version CHAR(10) NOT NULL, PRIMARY KEY(version)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB`);
    return new Set();
  }
}

export async function runMigrations() {
  const files = await fs.readdir(__dirname);
  const versions = files.filter((file) => regex.test(file)).map((file) => file.split('.')[0]);
  versions.sort();

  if (versions.length) {
    const installed = await loadMigrations();
    for (const version of versions) {
      if (!installed.has(version)) {
        console.log(`Importing migration ${version} ...`);
        const runner = await import(`./${version}`);
        await getTransactional(null, async (update) => {
          await update('SET @TRIGGER_CHECKS = FALSE');
          console.log(`Executing migration ${version} ...`);
          await runner.run(update);
          console.log(`Writing version ${version} ...`);
          await update('INSERT INTO versions VALUES (?)', [version]);
        });
      }
    }
  }
}

import server from './Server';
import './Auth';
import './channels';
import { runMigrations } from './database/migrations/Migration';

(async () => {
  await runMigrations();
  await server.listen();
})();

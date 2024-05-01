import {runMigrations} from './migrations/Migration';
import server from './Server';
import './Auth';
import './channels';

(async () => {
  await runMigrations();
  await server.listen();
})();

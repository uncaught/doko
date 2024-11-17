import {initApi} from './Api';
import {runMigrations} from './migrations/Migration';
import {initLogux} from './Server';
import './Auth';
import './channels';

(async () => {
  await runMigrations();
  await initLogux();
  await initApi();
})();

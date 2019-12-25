import server from './Server';
import {Credentials} from '@doko/common/Auth';
import {query} from './Connection';
import {isUuid} from '@doko/common/Uuid';

server.auth(async (userId: string, credentials: Credentials) => {
  if (!isUuid(userId)) {
    throw new Error(`Invalid uuid '${userId}'`);
  }
  await query(`INSERT INTO users (id, created_on, created_creds, last_seen_on, last_seen_creds)
VALUES (:id, NOW(), :creds, NOW(), :creds)
ON DUPLICATE KEY UPDATE last_seen_on = VALUES(last_seen_on), last_seen_creds = VALUES(last_seen_creds)`, {
    id: userId,
    creds: JSON.stringify(credentials),
  });
  return true;
});

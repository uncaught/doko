import server from './Server';
import {Credentials, isUuid} from '@doko/common';
import {query} from './Connection';

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

const cacheUserGroupIds = new Map<string, Promise<Set<string>>>();

export function getUserGroupIds(userId: string): Promise<Set<string>> {
  if (!cacheUserGroupIds.has(userId)) {
    const prom = query<{ group_id: string }>(`SELECT DISTINCT gm.group_id
                                FROM group_member_users gmu
                          INNER JOIN group_members gm ON gm.id = gmu.group_member_id
                               WHERE gmu.user_id = :userId`, {userId})
      .then((result) => result.reduce<Set<string>>((acc, {group_id}) => acc.add(group_id), new Set()));
    cacheUserGroupIds.set(userId, prom);
  }
  return cacheUserGroupIds.get(userId)!;
}

export function clearUserGroupIdsCache(userId: string): void {
  cacheUserGroupIds.delete(userId);
}

export async function canReadGroup(userId: string, groupId: string): Promise<boolean> {
  //all members may read the group
  return (await getUserGroupIds(userId)).has(groupId);
}

export async function canEditGroup(userId: string, groupId: string): Promise<boolean> {
  //for now all members may edit the group
  return (await getUserGroupIds(userId)).has(groupId);
}

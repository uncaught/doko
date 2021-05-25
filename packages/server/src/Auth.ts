import server from './Server';
import {Credentials, isUuid} from '@doko/common';
import {query} from './Connection';

server.auth(async (deviceId: string, credentials: Credentials) => {
  if (!isUuid(deviceId)) {
    throw new Error(`Invalid uuid '${deviceId}'`);
  }
  await query(`INSERT INTO devices (id, created_on, created_creds, last_seen_on, last_seen_creds)
VALUES (:id, NOW(), :creds, NOW(), :creds)
ON DUPLICATE KEY UPDATE last_seen_on = VALUES(last_seen_on), last_seen_creds = VALUES(last_seen_creds)`, {
    id: deviceId,
    creds: JSON.stringify(credentials),
  });
  return true;
});

const cacheUserGroupIds = new Map<string, Promise<Set<string>>>();
const cacheUserGroupIdsSync = new Map<string, Set<string>>();

export function getUserGroupIds(deviceId: string): Promise<Set<string>> {
  if (!cacheUserGroupIds.has(deviceId)) {
    const prom = query<{ group_id: string }>(`SELECT DISTINCT gm.group_id
                                                FROM group_member_devices gmd
                                          INNER JOIN group_members gm ON gm.id = gmd.group_member_id
                                               WHERE gmd.device_id = :deviceId`, {deviceId})
      .then((result) => {
        const set = result.reduce<Set<string>>((acc, {group_id}) => acc.add(group_id), new Set());
        cacheUserGroupIdsSync.set(deviceId, set);
        return set;
      });
    cacheUserGroupIds.set(deviceId, prom);
  }
  return cacheUserGroupIds.get(deviceId)!;
}

export function getUserGroupIdsSync(deviceId: string): Set<string> {
  if (!cacheUserGroupIdsSync.has(deviceId)) {
    throw new Error('user-group-ids-set not loaded');
  }
  return cacheUserGroupIdsSync.get(deviceId)!;
}

export async function updateUserGroupIdsCache(deviceId: string, groupId: string): Promise<void> {
  if (cacheUserGroupIds.has(deviceId)) {
    const set = await cacheUserGroupIds.get(deviceId)!;
    set.add(groupId);
  }
}

export async function canReadGroup(deviceId: string, groupId: string): Promise<boolean> {
  //all members may read the group
  return (await getUserGroupIds(deviceId)).has(groupId);
}

export async function canEditGroup(deviceId: string, groupId: string): Promise<boolean> {
  //for now all members may edit the group
  return (await getUserGroupIds(deviceId)).has(groupId);
}

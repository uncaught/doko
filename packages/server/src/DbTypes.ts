import {AnyObject, Game, Group, GroupMember, Passkey, Player, Round, User} from '@doko/common';

type Table =
  | 'devices'
  | 'games'
  | 'group_member_devices'
  | 'group_members'
  | 'groups'
  | 'passkeys'
  | 'round_group_members'
  | 'rounds'
  | 'users';

export type DatabaseTypes<O extends AnyObject> = {
  [k in keyof O]?: 'unix' | 'json' | 'bool';
};

export interface DbConfig<O extends AnyObject> {
  table: Table;
  types: DatabaseTypes<O>;
  insertFields: Array<keyof O>;
  updateFields: Array<keyof O>;
}

export const groupsDbConfig: DbConfig<Group> = {
  table: 'groups',
  types: {
    settings: 'json',
  },
  insertFields: ['id', 'name', 'settings'],
  updateFields: ['name', 'settings'],
};

export const groupMembersDbConfig: DbConfig<GroupMember> = {
  table: 'group_members',
  types: {
    isRegular: 'bool',
    isYou: 'bool',
  },
  insertFields: ['id', 'groupId', 'name', 'isRegular'],
  updateFields: ['name', 'isRegular'],
};

export const groupMemberDevicesDbConfig: DbConfig<{
  groupMemberId: string;
  deviceId: string;
  inviterDeviceId: string;
  invitedOn: number;
}> = {
  table: 'group_member_devices',
  types: {
    invitedOn: 'unix',
  },
  insertFields: ['groupMemberId', 'deviceId', 'inviterDeviceId', 'invitedOn'],
  updateFields: [],
};

export const roundsDbConfig: DbConfig<Round> = {
  table: 'rounds',
  types: {
    startDate: 'unix',
    endDate: 'unix',
    data: 'json',
  },
  insertFields: ['id', 'groupId', 'startDate', 'endDate', 'data'],
  updateFields: ['startDate', 'endDate', 'data'],
};

export const playersDbConfig: DbConfig<Player> = {
  table: 'round_group_members',
  types: {},
  insertFields: ['roundId', 'groupMemberId', 'sittingOrder', 'joinedAfterGameNumber', 'leftAfterGameNumber'],
  updateFields: ['joinedAfterGameNumber', 'leftAfterGameNumber'],
};

export const gamesDbConfig: DbConfig<Game> = {
  table: 'games',
  types: {
    data: 'json',
  },
  insertFields: ['id', 'roundId', 'gameNumber', 'dealerGroupMemberId', 'data'],
  updateFields: ['data'],
};

export const passkeysDbConfig: DbConfig<Passkey> = {
  table: 'passkeys',
  types: {
    backedUp: 'bool',
    transports: 'json',
  },
  insertFields: ['id', 'publicKey', 'userId', 'webAuthnUserId', 'counter', 'deviceType', 'backedUp', 'transports'],
  updateFields: ['counter'],
};

export const usersDbConfig: DbConfig<User> = {
  table: 'users',
  types: {},
  insertFields: ['id', 'username', 'createdOn', 'lastSeenOn'],
  updateFields: [],
};

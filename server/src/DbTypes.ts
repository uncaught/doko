import {AnyObject, Group, GroupMember, Round} from '@doko/common';

type Table =
  'devices'
  | 'groups'
  | 'group_members'
  | 'group_member_devices'
  | 'rounds'
  | 'round_group_members'
  | 'games';

export type DatabaseTypes<O extends AnyObject> = {
  [k in keyof O]?: 'unix' | 'json' | 'bool';
};

export interface DbConfig<O extends AnyObject> {
  table: Table;
  types: DatabaseTypes<O>;
  insertFields: Array<keyof O>,
  updateFields: Array<keyof O>,
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
  },
  insertFields: ['id', 'groupId', 'startDate', 'endDate'],
  updateFields: ['startDate', 'endDate'],
};

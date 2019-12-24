import {Group} from './Entities';

export interface GroupsLoad {
  type: 'groups/load';
}

export interface GroupsAll {
  type: 'groups/all';
  groups: Group[];
}

export interface GroupsAdd {
  type: 'groups/add';
  group: Group;
}

export interface GroupsRename {
  type: 'groups/rename';
  groupId: string;
  name: string;
}

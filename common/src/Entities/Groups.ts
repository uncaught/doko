export interface Group {
  id: string;
  name: string;
  lastGameUnix?: number;
}

export interface Groups {
  [id: string]: Group;
}

export interface GroupsLoad {
  channel: 'groups/load';
}

export interface GroupsLoaded {
  type: 'groups/loaded';
  groups: Group[];
}

export interface GroupsAdd {
  type: 'groups/add';
  group: Group;
}

export interface GroupsPatch {
  type: 'groups/patch';
  id: string;
  group: Partial<Omit<Group, 'id'>>;
}

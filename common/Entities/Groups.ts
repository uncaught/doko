export interface Group {
  id: string;
  name: string;
}

export interface Groups {
  [id: string]: Group;
}

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

export interface GroupsPatch {
  type: 'groups/patch';
  id: string;
  group: Partial<Omit<Group, 'id'>>;
}

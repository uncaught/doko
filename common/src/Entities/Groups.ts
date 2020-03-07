import {GroupMember} from './GroupMembers';
import {GroupSettings} from './GroupSettings';
import {DeepPartial} from '../Generics';

export interface Group {
  id: string;
  name: string;
  settings: GroupSettings;
  isNew?: true;
  lastRoundUnix: number | null;
  roundsCount: number;
  completedRoundsCount: number;
}

export type PatchableGroup = DeepPartial<Pick<Group, 'name' | 'settings'>>;

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
  groupMember: GroupMember; //self, initial member
}

export interface GroupsAdded {
  type: 'groups/added';
  groupId: string;
}

export interface GroupsPatch {
  type: 'groups/patch';
  id: string;
  group: PatchableGroup;
}

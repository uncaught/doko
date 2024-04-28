import {DeepPartial} from '../Generics';
import {Group} from './Groups';
import {Player} from './Players';
import {Statistics} from './Statistics';

export interface GroupMember {
  id: string;
  groupId: string;
  name: string;
  isRegular: boolean;
  isYou?: boolean;
}

export interface GroupMemberRoundStats {
  roundsCount: number;
  pointBalance: number;
  pointDiffToTopPlayer: number;
  euroBalance: number | null;
  statistics: Statistics;
}

export type GroupMemberWithRoundStats = GroupMember & GroupMemberRoundStats;

export interface GroupMembersWithRoundStats {
  [id: string]: GroupMemberWithRoundStats;
}

export type PatchableGroupMember = DeepPartial<Pick<GroupMember, 'name' | 'isRegular'>>;

export interface GroupGroupMembers {
  [id: string]: GroupMember;
}

export interface GroupMembers {
  [groupId: string]: GroupGroupMembers;
}

export interface GroupMembersLoad {
  channel: 'groupMembers/load';
  groupId: string;
}

export interface GroupMembersLoaded {
  type: 'groupMembers/loaded';
  groupId: string;
  groupMembers: GroupMember[];
}

export interface GroupMembersAdd {
  type: 'groupMembers/add';
  groupMember: GroupMember;
  newRoundPlayer: Player | null;
}

export interface GroupMembersPatch {
  type: 'groupMembers/patch';
  id: string;
  groupId: string;
  groupMember: PatchableGroupMember;
}

export interface GroupMembersInvite {
  type: 'groupMembers/invite';
  groupId: string;
  groupMemberId: string;
  invitationToken: string;
}

export interface GroupMembersAcceptInvitation {
  type: 'groupMembers/acceptInvitation';
  token: string;
}

export interface GroupMembersInvitationRejected {
  type: 'groupMembers/invitationRejected';
  token: string;
}

export interface GroupMembersInvitationAccepted {
  type: 'groupMembers/invitationAccepted';
  token: string;
  groupId: string;
  group: Group;
}

export interface GroupMembersInvitationUsed {
  type: 'groupMembers/invitationUsed';
  token: string;
}

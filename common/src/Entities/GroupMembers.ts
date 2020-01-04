import {Group} from './Groups';
import {DeepPartial} from '../Generics';

export interface GroupMember {
  id: string;
  groupId: string;
  name: string;
  isRegular: boolean;
  isYou?: boolean;
  roundsCount?: number;
  pointBalance?: number;
  euroBalance?: number;
}

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
}

export interface GroupMembersPatch {
  type: 'groupMembers/patch';
  id: string;
  groupId: string;
  groupMember: DeepPartial<Omit<GroupMember, 'id' | 'groupId'>>;
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

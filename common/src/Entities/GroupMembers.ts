export interface GroupMember {
  id: string;
  groupId: string;
  name: string;
  roundsCount?: number;
  pointBalance?: number;
  euroBalance?: number;
}

export interface GroupMembers {
  [groupId: string]: {
    [id: string]: GroupMember;
  };
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
  groupMember: Partial<Omit<GroupMember, 'id' | 'groupId'>>;
}

export interface GroupMembersInvite {
  type: 'groupMembers/invite';
  groupId: string;
  groupMemberId: string;
}

export interface GroupMembersInvited {
  type: 'groupMembers/invited';
  groupId: string;
  groupMemberId: string;
  invitationToken: string;
}

export interface GroupMembersAcceptInvitation {
  type: 'groupMembers/acceptInvitation';
  groupId: string;
  groupMemberId: string;
  invitationToken: string;
}

import {
  DeepPartial,
  GroupMembersInvitationAccepted,
  GroupMembersInvitationRejected,
  GroupMembersInvitationUsed,
  mergeStates,
  SubType,
} from '@doko/common';
import {createReducer} from './Reducer';
import {State} from './Store';

export interface Ui {
  acceptedInvitations: { [token: string]: string }, //token => groupId for the invitee
  rejectedInvitations: string[]; //for the invitee
  usedInvitationTokens: string[]; //for the inviter
}

export interface UiSet {
  type: 'ui/set';
  ui: DeepPartial<Ui>;
}

const initial: Ui = {
  acceptedInvitations: {},
  rejectedInvitations: [],
  usedInvitationTokens: [],
};

function addUniqueToken(key: keyof SubType<Ui, string[]>) {
  return (state: Ui, {token}: { token: string }): Ui => {
    const set = new Set(state[key]);
    if (!set.has(token)) {
      return {
        ...state,
        [key]: [...set.add(token)],
      };
    }
    return state;
  };
}

const {addReducer, combinedReducer} = createReducer<Ui>(initial);

addReducer<UiSet>('ui/set', (state, action) => mergeStates(state, action.ui));

addReducer<GroupMembersInvitationAccepted>('groupMembers/invitationAccepted',
  (state, {groupId, token}) => mergeStates(state, {acceptedInvitations: {[token]: groupId}}));

addReducer<GroupMembersInvitationRejected>('groupMembers/invitationRejected', addUniqueToken('rejectedInvitations'));

addReducer<GroupMembersInvitationUsed>('groupMembers/invitationUsed', addUniqueToken('usedInvitationTokens'));

export const uiReducer = combinedReducer;

export const acceptedInvitationsSelector = (state: State) => state.ui.acceptedInvitations;
export const rejectedInvitationsSelector = (state: State) => state.ui.rejectedInvitations;
export const usedInvitationTokensSelector = (state: State) => state.ui.usedInvitationTokens;

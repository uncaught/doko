import {DeepPartial, GroupMembersInvitationAccepted, GroupMembersInvitationUsed, mergeStates} from '@doko/common';
import {createReducer} from './Reducer';
import {State} from './Store';

export interface Ui {
  acceptedInvitations: { [token: string]: string }, //token => groupId for the invitee
  usedInvitationTokens: string[]; //for the inviter
}

export interface UiSet {
  type: 'ui/set';
  ui: DeepPartial<Ui>;
}

const initial: Ui = {
  acceptedInvitations: {},
  usedInvitationTokens: [],
};

const {addReducer, combinedReducer} = createReducer<Ui>(initial);

addReducer<UiSet>('ui/set', (state, action) => mergeStates(state, action.ui));

addReducer<GroupMembersInvitationAccepted>('groupMembers/invitationAccepted',
  (state, {groupId, token}) => mergeStates(state, {acceptedInvitations: {[token]: groupId}}));

addReducer<GroupMembersInvitationUsed>('groupMembers/invitationUsed',
  (state, {token}) => {
    console.error('groupMembers/invitationUsed', token);
    const set = new Set(state.usedInvitationTokens);
    if (!set.has(token)) {
      return {
        ...state,
        usedInvitationTokens: [...set.add(token)],
      };
    }
    return state;
  });

export const uiReducer = combinedReducer;

export const acceptedInvitationsSelector = (state: State) => state.ui.acceptedInvitations;
export const usedInvitationTokensSelector = (state: State) => state.ui.usedInvitationTokens;

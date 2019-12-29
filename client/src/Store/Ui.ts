import {DeepPartial, GroupMembersInvitationAccepted, GroupMembersInvitationUsed, mergeStates} from '@doko/common';
import {createReducer} from './Reducer';
import {State} from './Store';

export interface Ui {
  invitedToGroupId: string;
  usedInvitationTokens: string[];
}

export interface UiSet {
  type: 'ui/set';
  ui: DeepPartial<Ui>;
}

const initial: Ui = {
  invitedToGroupId: '',
  usedInvitationTokens: [],
};

const {addReducer, combinedReducer} = createReducer<Ui>(initial);

addReducer<UiSet>('ui/set', (state, action) => mergeStates(state, action.ui));

addReducer<GroupMembersInvitationAccepted>('groupMembers/invitationAccepted',
  (state, {groupId}) => mergeStates(state, {invitedToGroupId: groupId}));

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

export const invitedToGroupIdSelector = (state: State) => state.ui.invitedToGroupId;
export const usedInvitationTokensSelector = (state: State) => state.ui.usedInvitationTokens;

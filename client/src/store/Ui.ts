import {
  DeepPartial,
  GamesAdd,
  GroupMembersInvitationAccepted,
  GroupMembersInvitationRejected,
  GroupMembersInvitationUsed,
  mergeStates,
  SubType,
} from '@doko/common';
import { createReducer, isAction } from './Reducer';
import { State } from './Store';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { LoguxDispatch } from './Logux';
import { useCallback, useEffect } from 'react';
import * as LocalStorage from '../LocalStorage';
import { useHistory } from 'react-router-dom';
import { getRoundByIdSelector } from './Rounds';
import Log from '@logux/core/log';

export interface Ui {
  acceptedInvitations: { [token: string]: string }, //token => groupId for the invitee
  followLastGame: boolean;
  rejectedInvitations: string[]; //for the invitee
  usedInvitationTokens: string[]; //for the inviter
  statistics: {
    filter: 'gameTypes' | 'soloTypes' | 'announces' | 'missedAnnounces';
    includeIrregularMembers: boolean;
    selectedRow: string | null;
  };
}

export interface UiSet {
  type: 'ui/set';
  ui: DeepPartial<Ui>;
}

const initial: Ui = {
  acceptedInvitations: {},
  followLastGame: false,
  rejectedInvitations: [],
  usedInvitationTokens: [],
  statistics: {
    filter: 'gameTypes',
    includeIrregularMembers: false,
    selectedRow: null,
  },
};

function addUniqueToken(key: keyof SubType<Ui, string[]>) {
  return (state: Ui, { token }: { token: string }): Ui => {
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

const localStorageSync: Array<keyof Ui> = ['followLastGame'];

function getInitialState(): Ui {
  const state = { ...initial };
  localStorageSync.forEach((key) => {
    const parsed = LocalStorage.getSetting<any>(`ui.${key}`);
    if (parsed !== null) {
      state[key] = parsed;
    }
  });
  return state;
}

const { addReducer, combinedReducer } = createReducer<Ui>(getInitialState());

addReducer<UiSet>('ui/set', (state, action) => {
  const newState = mergeStates(state, action.ui);
  localStorageSync.forEach((key) => {
    if (state[key] !== newState[key]) {
      LocalStorage.setSetting(`ui.${key}`, newState[key]);
    }
  });
  return newState;
});

addReducer<GroupMembersInvitationAccepted>('groupMembers/invitationAccepted',
  (state, { groupId, token }) => mergeStates(state, { acceptedInvitations: { [token]: groupId } }));

addReducer<GroupMembersInvitationRejected>('groupMembers/invitationRejected', addUniqueToken('rejectedInvitations'));

addReducer<GroupMembersInvitationUsed>('groupMembers/invitationUsed', addUniqueToken('usedInvitationTokens'));

export const uiReducer = combinedReducer;

export const acceptedInvitationsSelector = (state: State) => state.ui.acceptedInvitations;
export const followLastGameSelector = (state: State) => state.ui.followLastGame;
export const rejectedInvitationsSelector = (state: State) => state.ui.rejectedInvitations;
export const usedInvitationTokensSelector = (state: State) => state.ui.usedInvitationTokens;
export const statisticsSelector = (state: State) => state.ui.statistics;

export function useSetUi() {
  const dispatch = useDispatch<LoguxDispatch>();
  return useCallback((ui: DeepPartial<Ui>): void => {
    dispatch({ type: 'ui/set', ui } as UiSet);
  }, [dispatch]);
}

export function useFollowLatestGame() {
  const getRoundById = useSelector(getRoundByIdSelector);
  const followLastGame = useSelector(followLastGameSelector);
  const history = useHistory();
  const store = useStore() as unknown as { log: Log };
  useEffect(() => {
    if (followLastGame) {
      return store.log.on('add', (action) => {
        if (isAction<GamesAdd>(action, 'games/add')) {
          const { game } = action;
          const round = getRoundById(game.roundId);
          if (round) {
            history.push(`/group/${round.groupId}/rounds/round/${game.roundId}/games/game/${game.id}`);
          }
        }
      });
    }
  }, [followLastGame, history, store, getRoundById]);
}

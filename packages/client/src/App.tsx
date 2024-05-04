import {GroupsLoad} from '@doko/common';
import useSubscription from '@logux/redux/use-subscription';
import React, {ReactElement} from 'react';
import {Route, Routes} from 'react-router-dom';
import './App.css';
import './DarkMode.scss';
import Game from './pages/game';
import Games from './pages/games';
import Group from './pages/group';
import AddMembers from './pages/group/AddMembers';
import Settings from './pages/group/Settings';
import Groups from './pages/groups';
import HandleInvitation from './pages/HandleInvitation';
import Member from './pages/member/Member';
import PotIndex from './pages/pot';
import Round from './pages/round';
import SittingOrder from './pages/round/SittingOrder';
import Rounds from './pages/rounds';
import Simulation from './pages/Simulation';
import Statistics from './pages/statistics/Statistics';
import {useFollowLatestGame} from './store/Ui';

export default function App(): ReactElement | null {
  useSubscription<GroupsLoad>(['groups/load']);
  useFollowLatestGame();

  return <Routes>
    <Route path='/group/:groupId' element={<Group/>}>
      <Route path={'settings'} element={<Settings/>}/>
      <Route path={'member/:groupMemberId'} element={<Member/>}/>
      <Route path={'addMembers'} element={<AddMembers/>}/>
      <Route path={'statistics'} element={<Statistics/>}/>
      <Route path={'pot'} element={<PotIndex/>}/>
      <Route path={'rounds'} element={<Rounds/>}>
        <Route path={'round/:roundId'} element={<Round/>}>
          <Route path={'players'} element={<SittingOrder/>}/>
          <Route path={'games'} element={<Games/>}>
            <Route path={'game/:gameId'} element={<Game/>}/>
          </Route>
        </Route>
      </Route>
    </Route>
    <Route path='/invitation' element={<HandleInvitation/>}/>
    <Route path='/simulation' element={<Simulation/>}/>
    <Route path='/' element={<Groups/>}/>
  </Routes>;
}

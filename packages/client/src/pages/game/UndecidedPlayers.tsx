import React, {ReactElement} from 'react';
import {Segment} from 'semantic-ui-react';
import {undecided, useGame} from '../../store/Games';
import {useGroupMembers} from '../../store/GroupMembers';
import GamePlayer from './GamePlayer';

export default function UndecidedPlayers(): ReactElement {
  const {data} = useGame()!;
  const members = useGroupMembers();
  const undecidedPlayers = undecided(data);
  return <>
    {undecidedPlayers.length > 0 && <>
      <Segment vertical className='u-flex-row-around u-flex-wrap'>
        {undecidedPlayers.map((id) => <GamePlayer key={id} member={members[id]!}/>)}
      </Segment>
    </>}
  </>;
}

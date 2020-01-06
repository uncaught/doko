import React, {ReactElement} from 'react';
import {Segment} from 'semantic-ui-react';
import GamePlayer from './GamePlayer';
import {useGamePlayers} from '../../store/Games';

export default function UndecidedPlayers(): ReactElement {
  const gamePlayers = useGamePlayers()!;
  return <>
    {gamePlayers.undecided.length > 0 && <>
      <Segment vertical className="u-flex-row-around u-flex-wrap">
        {gamePlayers.undecided.map(({member}) => <GamePlayer key={member.id} member={member}/>)}
      </Segment>
    </>}
  </>;
}

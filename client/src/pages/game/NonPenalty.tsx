import React, {ReactElement} from 'react';
import {Divider, Grid, Segment} from 'semantic-ui-react';
import Side from './Side';
import GamePlayer from './GamePlayer';
import {useGamePlayers} from '../../store/Games';

export default function NonPenalty(): ReactElement {
  const gamePlayers = useGamePlayers()!;
  return <>
    <Segment vertical>
      <Grid columns={2} relaxed='very'>
        <Side re/>
        <Side contra/>
      </Grid>
      <Divider vertical>VS</Divider>
    </Segment>
    {gamePlayers.undecided.length > 0 && <>
      <Segment vertical className="u-flex-row-around u-flex-wrap">
        {gamePlayers.undecided.map(({member}) => <GamePlayer key={member.id} member={member}/>)}
      </Segment>
    </>}
  </>;
}

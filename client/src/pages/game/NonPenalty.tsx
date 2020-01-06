import React, {ReactElement} from 'react';
import {Divider, Grid, Segment} from 'semantic-ui-react';
import Side from './Side';
import UndecidedPlayers from './UndecidedPlayers';
import GameCalcBlame from './GameCalcBlame';

export default function NonPenalty(): ReactElement {
  return <>
    <Segment vertical>
      <Grid columns={2} relaxed='very' className="tinyVertical">
        <Side isRe={true}/>
        <Side isRe={false}/>
      </Grid>
      <Divider vertical>VS</Divider>
    </Segment>
    <UndecidedPlayers/>
    <GameCalcBlame/>
  </>;
}

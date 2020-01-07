import React, {ReactElement} from 'react';
import {Divider, Grid, Segment} from 'semantic-ui-react';
import UndecidedPlayers from './UndecidedPlayers';
import GameCalcBlame from './GameCalcBlame';
import Announcements from './Announcements';
import ExtraPoints from './ExtraPoints';
import SidePlayers from './SidePlayers';
import GamePips from './GamePips';
import Points from './Points';

function Row({Comp}: { Comp: React.FC<{ isRe: boolean }> }): ReactElement {
  return <Grid.Row>
    <Grid.Column>
      <Comp isRe={true}/>
    </Grid.Column>
    <Grid.Column>
      <Comp isRe={false}/>
    </Grid.Column>
  </Grid.Row>;
}

export default function NonPenalty(): ReactElement {
  return <>
    <Segment vertical>
      <Grid columns={2} relaxed='very' className="tinyVertical">
        <Row Comp={Announcements}/>
        <Row Comp={ExtraPoints}/>
        <Row Comp={SidePlayers}/>
        <Row Comp={GamePips}/>
        <Row Comp={Points}/>
      </Grid>
      <Divider vertical>VS</Divider>
    </Segment>
    <UndecidedPlayers/>
    <GameCalcBlame/>
  </>;
}

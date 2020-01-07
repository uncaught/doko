import React, {ReactElement} from 'react';
import {Grid} from 'semantic-ui-react';
import SidePlayers from './SidePlayers';
import ExtraPoints from './ExtraPoints';
import GamePips from './GamePips';
import Points from './Points';
import Announcements from './Announcements';

export default function Side({isRe}: { isRe: boolean }): ReactElement | null {
  return <Grid.Column>
    <Announcements isRe={isRe}/>
    <ExtraPoints isRe={isRe}/>
    <SidePlayers isRe={isRe}/>
    <GamePips isRe={isRe}/>
    <Points isRe={isRe}/>
  </Grid.Column>;
}

import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import {useGamePlayers} from '../../store/Games';
import GamePlayer from './GamePlayer';

export default function SidePlayers({isRe}: { isRe: boolean }): ReactElement {
  const gamePlayers = useGamePlayers()!;
  const sidePlayers = gamePlayers[isRe ? 're' : 'contra'];
  return <>
    {sidePlayers.length > 0 && <>
      <Divider className="tiny"/>
      <div className="u-flex-row u-flex-wrap">
        {sidePlayers.map(({member}) => <GamePlayer key={member.id} member={member}/>)}
      </div>
    </>}
  </>;
}

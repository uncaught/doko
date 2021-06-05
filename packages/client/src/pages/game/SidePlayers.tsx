import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import {useGame} from '../../store/Games';
import GamePlayer from './GamePlayer';
import {useGroupMembers} from '../../store/GroupMembers';

export default function SidePlayers({isRe}: { isRe: boolean }): ReactElement {
  const {data} = useGame()!;
  const members = useGroupMembers();
  const sidePlayers = data[isRe ? 're' : 'contra'].members;
  return <>
    {sidePlayers.length > 0 && <>
      <Divider className="tiny"/>
      <div className="u-flex-row u-flex-wrap">
        {sidePlayers.map((id) => <GamePlayer key={id} member={members[id]}/>)}
      </div>
    </>}
  </>;
}

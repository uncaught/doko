import React, {ReactElement} from 'react';
import {Divider, Grid} from 'semantic-ui-react';
import {useGamePlayers} from '../../store/Games';
import Announcing from './Announcing';
import GamePlayer from './GamePlayer';

interface SideProps {
  re?: boolean;
  contra?: boolean;
}

export default function Side({re: isRe = false}: SideProps): ReactElement | null {
  const gamePlayers = useGamePlayers()!;
  const sidePlayers = gamePlayers[isRe ? 're' : 'contra'];

  return <Grid.Column>
    <Announcing type={'announced'} label={isRe ? 'Re' : 'Contra'} isRe={!!isRe}/>
    <Announcing type={'no9'} label={'keine 9'} isRe={isRe}/>
    <Announcing type={'no6'} label={'keine 6'} isRe={isRe}/>
    <Announcing type={'no3'} label={'keine 3'} isRe={isRe}/>
    <Announcing type={'no0'} label={'schwarz'} isRe={isRe}/>
    {sidePlayers.length > 0 && <>
      <Divider/>
      {sidePlayers.map(({member}) => <GamePlayer key={member.id} member={member}/>)}
    </>}
  </Grid.Column>;
}

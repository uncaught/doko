import React, {ReactElement} from 'react';
import {Header, Icon, Label, List} from 'semantic-ui-react';
import {usePlayersWithStats} from '../../store/Players';
import {useRound} from '../../store/Rounds';

export default function Players(): ReactElement {
  const round = useRound();
  const players = usePlayersWithStats();

  return <section>
    <Header as='h4'>Spielstand</Header>

    <List divided relaxed>
      {players.map(({pointDiffToTopPlayer, member, pointBalance, dutySoloPlayed}) =>
        <List.Item key={member.id}>
          <List.Icon color={'black'} size={'large'} name='user' verticalAlign='middle'/>
          <List.Content>
            <List.Header>{member.name}</List.Header>
            <List.Description>
              <Label size={'small'} color={pointBalance >= 0 ? 'green' : 'red'}>
                {pointBalance} <Icon name='sort'/>
              </Label>
              {!!round!.data.eurosPerPointDiffToTopPlayer && <Label size={'small'} color={'blue'}>
                {(pointDiffToTopPlayer * round!.data.eurosPerPointDiffToTopPlayer).toFixed(2)} <Icon name='euro sign'/>
              </Label>}
              <Label size={'small'} color={dutySoloPlayed ? 'green' : 'red'}>
                <span className={dutySoloPlayed ? '' : 'u-line-through'}>Solo</span> <Icon name='male'/>
              </Label>
              {!!member.isYou && <Label size={'small'} color={'teal'}>
                du <Icon name='linkify'/>
              </Label>}
            </List.Description>
          </List.Content>
        </List.Item>)}
    </List>
  </section>;
}

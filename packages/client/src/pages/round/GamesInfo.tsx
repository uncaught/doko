import React, {ReactElement} from 'react';
import {Header, Icon, Label} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useSortedGames} from '../../store/Games';
import AddGame from './AddGame';
import RoundEndInfo from './RoundEndInfo';

export default function GamesInfo(): ReactElement {
  const sortedGames = useSortedGames();
  const lastGame = sortedGames[sortedGames.length - 1];
  const hasOpenGame = !!lastGame && !lastGame.data.isComplete;

  return <section>
    <Header as='h4'>Spiele</Header>

    <div className='memberDetail'>
      <Label as={asLink(`games`)} color={'orange'}>
        Alle Spiele
        <Label.Detail>
          {sortedGames.length} <Icon name={'hashtag'}/>
        </Label.Detail>
      </Label>
    </div>

    <RoundEndInfo/>

    {hasOpenGame && <div className='memberDetail'>
      <Label as={asLink(`games/game/${lastGame.id}`)} color={'blue'}>
        Laufendes Spiel
      </Label>
    </div>}

    <AddGame/>
  </section>;
}

import React, {ReactElement} from 'react';
import {Header, Icon, Label} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useRouteMatch} from 'react-router-dom';
import {useSortedGames} from '../../store/Games';
import AddGame from './AddGame';

export default function GamesInfo(): ReactElement {
  const {url} = useRouteMatch();
  const sortedGames = useSortedGames();
  const lastGame = sortedGames[sortedGames.length - 1];
  const hasOpenGame = !!lastGame && !lastGame.data.isComplete;

  return <section>
    <Header as='h4'>Spiele</Header>

    <div className="memberDetail">
      <Label as={asLink(`${url}/games`)} color={'orange'}>
        Alle Spiele
        <Label.Detail>
          {sortedGames.length} <Icon name={'hashtag'}/>
        </Label.Detail>
      </Label>
    </div>

    {hasOpenGame && <div className="memberDetail">
      <Label as={asLink(`${url}/games/game/${lastGame.id}`)} color={'blue'}>
        Laufendes Spiel
      </Label>
    </div>}

    <AddGame/>
  </section>;
}

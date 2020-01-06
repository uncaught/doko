import React, {ReactElement} from 'react';
import {Header, Icon, Label} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useRouteMatch} from 'react-router-dom';
import {useAddGame, useSortedGames} from '../../store/Games';

export default function GamesInfo(): ReactElement {
  const {url} = useRouteMatch();
  const games = useSortedGames();
  const addGame = useAddGame();
  const lastGame = games[0];
  const hasOpenGame = !!lastGame && !lastGame.data.isComplete;

  return <section>
    <Header as='h4'>Spiele</Header>

    <div className="memberDetail">
      <Label as={asLink(`${url}/games`)} color={'orange'}>
        Alle Spiele
        <Label.Detail>
          {games.length} <Icon name={'hashtag'}/>
        </Label.Detail>
      </Label>
    </div>

    {hasOpenGame && <div className="memberDetail">
      <Label as={asLink(`${url}/games/game/${lastGame.id}`)} color={'blue'}>
        Laufendes Spiel
      </Label>
    </div>}

    {!hasOpenGame && <div className="memberDetail">
      <Label color={'green'} onClick={addGame}>
        Neues Spiel
        <Label.Detail>
          <Icon name={'plus'}/>
        </Label.Detail>
      </Label>
    </div>}
  </section>;
}

import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {useAddGame, useSortedGames} from '../../store/Games';

export default function AddGame(): ReactElement | null {
  const sortedGames = useSortedGames();
  const addGame = useAddGame();
  const lastGame = sortedGames[sortedGames.length - 1];
  if (lastGame && (!lastGame.data.isComplete || lastGame.data.isLastGame)) {
    return null;
  }
  return <div className="memberDetail">
    <Label color={'green'} onClick={addGame}>
      Neues Spiel
      <Label.Detail>
        <Icon name={'plus'}/>
      </Label.Detail>
    </Label>
  </div>;
}

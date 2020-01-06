import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {useAddGame, useGame, useSortedGames} from '../../store/Games';
import {asLink} from '../../AsLink';
import {useRound} from '../../store/Rounds';

export default function GameLabelNext(): ReactElement {
  const currentRound = useRound()!;
  const game = useGame()!;
  const sortedGames = useSortedGames();
  const index = sortedGames.indexOf(game);
  const nextGame = sortedGames[index + 1];
  const addGame = useAddGame();
  return <>
    <div className="memberDetail">
      {!!nextGame &&
      <Label as={asLink(`/groups/group/${currentRound.groupId}/rounds/round/${currentRound.id}/games/game/${nextGame.id}`)}
             color={'blue'}>
        <Icon className="u-margin-none" name={'hashtag'}/> <Icon name={'arrow right'}/>
      </Label>}
      {!nextGame && !game.data.isComplete && <Label>
        <Icon className="u-margin-none" name={'hashtag'}/> <Icon name={'arrow right'}/>
      </Label>}
      {!nextGame && game.data.isComplete && <Label color={'green'} onClick={addGame}>
        <Icon className="u-margin-none" name={'plus'}/> <Icon name={'arrow right'}/>
      </Label>}
    </div>
  </>;
}

import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useGame, useSortedGames} from '../../store/Games';
import {useRound} from '../../store/Rounds';

export default function GameLabelPrev(): ReactElement {
  const currentRound = useRound()!;
  const game = useGame()!;
  const sortedGames = useSortedGames();
  const index = sortedGames.indexOf(game);
  const prevGame = sortedGames[index - 1];
  return (
    <>
      <div className='memberDetail'>
        {!!prevGame && (
          <Label
            as={asLink(`/group/${currentRound.groupId}/rounds/round/${currentRound.id}/games/game/${prevGame.id}`)}
            color={'blue'}
          >
            <Icon className='u-margin-none' name={'arrow left'} /> <Icon name={'hashtag'} />
          </Label>
        )}
        {!prevGame && (
          <Label>
            <Icon className='u-margin-none' name={'arrow left'} /> <Icon name={'hashtag'} />
          </Label>
        )}
      </div>
    </>
  );
}

import React, {ReactElement} from 'react';
import {Icon, Label, Popup} from 'semantic-ui-react';
import {useGame, useSortedGames} from '../../store/Games';
import {useRoundParticipatingPlayers} from '../../store/Players';
import {useRound} from '../../store/Rounds';

function Remaining(): ReactElement {
  const sortedGames = useSortedGames();
  const game = useGame()!;
  const roundParticipatingPlayers = useRoundParticipatingPlayers();
  const playerCount = roundParticipatingPlayers.length;
  const gameIndex = game.gameNumber - 1;
  let bockStartIndex = -1;
  let soloCount = game.data.gameType === 'dutySolo' ? 1 : 0;
  for (let i = gameIndex - 1; i >= 0; i--) {
    const curGame = sortedGames[i];
    if (curGame) {
      if (curGame.data.gameType === 'dutySolo') {
        soloCount++;
      }
      if (curGame.data.qualifiesNewBockGames) {
        bockStartIndex = i + 1;
        break;
      }
    }
  }
  if (bockStartIndex > -1) {
    const number = gameIndex - bockStartIndex + 1;
    return (
      <div>
        <div>Bockspiel #{number}</div>
        <div>Voraussichtlich noch {playerCount - number + soloCount}</div>
      </div>
    );
  }
  return <div>???</div>;
}

export default function GameLabelBock(): ReactElement | null {
  const popupDisabled = useRound()!.data.bockInBockBehavior !== 'restart';
  const {data} = useGame()!;
  if (!data.bockGameWeight) {
    return null;
  }
  return (
    <Popup
      content={<Remaining />}
      pinned
      on={'click'}
      position={'bottom center'}
      disabled={popupDisabled}
      trigger={
        <div className='memberDetail'>
          <Label className={data.bockGameWeight > 1 ? '' : 'iconOnly'} color={'purple'}>
            {data.bockGameWeight > 1 ? data.bockGameWeight : ''} <Icon name={'btc'} />
          </Label>
        </div>
      }
    />
  );
}

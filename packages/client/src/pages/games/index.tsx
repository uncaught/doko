import {GameData, soloGameTypes} from '@doko/common';
import classnames from 'classnames';
import React, {ReactElement} from 'react';
import {useNavigate} from 'react-router-dom';
import {Divider, Icon} from 'semantic-ui-react';
import Page from '../../Page';
import {useSortedGames} from '../../store/Games';
import {useMemberInitials} from '../../store/GroupMembers';
import {useRoundParticipatingPlayers} from '../../store/Players';
import AddGame from '../round/AddGame';
import RoundEndInfo from '../round/RoundEndInfo';

function RoundIndicators({data}: {data: GameData}): ReactElement {
  const indicators: ReactElement[] = [];
  for (let i = 0; i < data.bockGameWeight; i++) {
    indicators.push(<Icon key={`bock_${i}`} size={'small'} color={'purple'} name={'btc'} />);
  }
  return <div className='gamesTable-cell-gameIndicators'>{indicators}</div>;
}

function RoundPlayerIndicators({data, memberId}: {data: GameData; memberId: string}): ReactElement {
  const indicators: ReactElement[] = [];
  if (
    (soloGameTypes.includes(data.gameType) && data.re.members.includes(memberId)) ||
    (data.gameType === 'penalty' &&
      data.contra.members.length === 1 &&
      data.contra.members[0] === memberId &&
      data.penaltyCountsAsDutySolo)
  ) {
    indicators.push(
      <Icon key={'solo'} size={'small'} color={data.gameType === 'lustSolo' ? 'blue' : 'red'} name={'dollar'} />,
    );
  }
  return <div className='gamesTable-cell-gameIndicators'>{indicators}</div>;
}

export default function Games(): ReactElement {
  const players = useRoundParticipatingPlayers();
  const games = useSortedGames();
  const initials = useMemberInitials();
  const sumMap = new Map<string, number>();
  const navigate = useNavigate();
  let lastRunNumber = 0;
  const rowCells: ReactElement[] = [];

  games.forEach(({id, gameNumber, data, dealerGroupMemberId}) => {
    const {gamePoints, gameType, re, contra, isComplete, winner, runNumber} = data;
    const isManual = gameType === 'manualInput';
    const isNewRun = lastRunNumber && lastRunNumber !== runNumber;
    lastRunNumber = runNumber;

    const rowClasses = ['grid-table-td'];
    const rowOnClick = () => navigate(`./game/${id}`);

    if (isNewRun) {
      rowClasses.push('topBorder');
    }
    const rowCss = rowClasses.join(' ');

    rowCells.push(
      <div key={`num_${gameNumber}`} className={rowCss} onClick={rowOnClick}>
        {gameNumber}
        <RoundIndicators data={data} />
      </div>,
    );

    rowCells.push(
      <div key={`dealer_${gameNumber}`} className={rowCss} onClick={rowOnClick}>
        {initials[dealerGroupMemberId]}
      </div>,
    );

    rowCells.push(
      <div key={`points_${gameNumber}`} className={rowCss} onClick={rowOnClick}>
        {isComplete && !isManual ? gamePoints : ''}
      </div>,
    );

    players.forEach((p) => {
      const isRe = re.members.includes(p.groupMemberId);
      const isContra = !isRe && contra.members.includes(p.groupMemberId);

      if ((!isRe && !isContra && !isManual) || !isComplete) {
        rowCells.push(
          <div key={`cell_${gameNumber}_${p.groupMemberId}`} className={rowCss} onClick={rowOnClick}>
            {isComplete ? '-' : ''}
          </div>,
        );
        return;
      }

      const points = isManual
        ? (data.manualInput?.points.find(({player}) => player === p.groupMemberId)?.points ?? 0)
        : data[isRe ? 're' : 'contra'].totalPoints;
      const newPoints = (sumMap.get(p.groupMemberId) || 0) + points;
      sumMap.set(p.groupMemberId, newPoints);

      const hasWon = isManual ? points > 0 : (winner === 're' && isRe) || (winner === 'contra' && isContra);
      const hasLost = isManual ? points < 0 : !hasWon && winner !== 'stalemate';

      rowCells.push(
        <div
          key={`cell_${gameNumber}_${p.groupMemberId}`}
          className={classnames(rowCss, {won: hasWon, lost: hasLost})}
          onClick={rowOnClick}
        >
          {newPoints}
          <RoundPlayerIndicators data={data} memberId={p.groupMemberId} />
        </div>,
      );
    });
  });

  return (
    <Page displayName={'Spiele'}>
      <section>
        <div
          className='grid-table gamesTable u-text-center'
          style={{gridTemplateColumns: `repeat(3, 2.3em) repeat(${players.length}, auto)`}}
        >
          <div className='grid-table-th'>#</div>
          <div className='grid-table-th'>
            <Icon name={'hand paper outline'} />
          </div>
          <div className='grid-table-th'>
            <Icon name={'bullseye'} />
          </div>
          {players.map((p) => (
            <div className='grid-table-th' key={p.groupMemberId}>
              {initials[p.groupMemberId]}
            </div>
          ))}
          {rowCells}
        </div>
        <Divider hidden />
        <RoundEndInfo />
        <AddGame />
      </section>
    </Page>
  );
}

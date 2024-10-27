import {logTexts} from '@doko/common';
import React from 'react';
import {List, Segment} from 'semantic-ui-react';
import {useGame} from '../../store/Games';

export default function GameCalcBlame(): React.ReactElement | null {
  const {data} = useGame()!;
  if (data.gameType === 'penalty' || !data.isComplete) {
    return null;
  }
  return (
    <Segment vertical>
      <List bulleted>
        {data.gameCalcLog.map((log, idx) => (
          <List.Item key={idx}>{logTexts[log]}</List.Item>
        ))}
      </List>
    </Segment>
  );
}

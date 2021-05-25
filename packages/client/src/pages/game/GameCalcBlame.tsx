import {List, Segment} from 'semantic-ui-react';
import React from 'react';
import {useGame} from '../../store/Games';
import {logTexts} from '@doko/common';

export default function GameCalcBlame(): React.ReactElement | null {
  const {data} = useGame()!;
  if (data.gameType === 'penalty' || !data.isComplete) {
    return null;
  }
  return <Segment vertical>
    <List bulleted>
      {data.gameCalcLog.map((log, idx) => <List.Item key={idx}>{logTexts[log]}</List.Item>)}
    </List>
  </Segment>;
}

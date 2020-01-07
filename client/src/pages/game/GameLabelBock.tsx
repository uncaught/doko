import React, {ReactElement} from 'react';
import {Icon, Label} from 'semantic-ui-react';
import {useGame} from '../../store/Games';

export default function GameLabelBock(): ReactElement | null {
  const {data} = useGame()!;
  if (!data.bockGameWeight) {
    return null;
  }
  return <div className="memberDetail">
    <Label className={data.bockGameWeight > 1 ? '' : 'iconOnly'} color={'purple'}>
      {data.bockGameWeight > 1 ? data.bockGameWeight : ''} <Icon name={'btc'}/>
    </Label>
  </div>;
}

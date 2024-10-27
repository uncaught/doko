import React, {ReactElement} from 'react';
import {Label} from 'semantic-ui-react';

interface Props {
  green?: boolean;
  points: number;
  red?: boolean;
}

export default function PointsLabel({green, points, red}: Props): ReactElement {
  return (
    <div className='memberDetail'>
      <Label color={green ? 'green' : red ? 'red' : undefined}>
        Punkte
        <Label.Detail>{points}</Label.Detail>
      </Label>
    </div>
  );
}

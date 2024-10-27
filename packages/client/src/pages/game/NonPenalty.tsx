import React, {ReactElement} from 'react';
import {useDrop} from 'react-dnd';
import {Divider, Grid, Segment} from 'semantic-ui-react';
import Announcements from './Announcements';
import ExtraPoints from './ExtraPoints';
import GameCalcBlame from './GameCalcBlame';
import GamePips from './GamePips';
import Points from './Points';
import {useSelectGamePlayerSide} from './SelectGamePlayerSide';
import SidePlayers from './SidePlayers';
import UndecidedPlayers from './UndecidedPlayers';

function Column({Comp, isRe}: {Comp: React.FC<{isRe: boolean}>; isRe: boolean}): ReactElement {
  const selectGamePlayerSide = useSelectGamePlayerSide();
  const [, drop] = useDrop<{memberId: string; type: string}, void, {}>({
    accept: 'gamePlayer',
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      selectGamePlayerSide(item.memberId, isRe);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({shallow: true}),
    }),
  });
  return (
    <div className={'column'} ref={drop}>
      <Comp isRe={isRe} />
    </div>
  );
}

function Row({Comp}: {Comp: React.FC<{isRe: boolean}>}): ReactElement {
  return (
    <Grid.Row>
      <Column Comp={Comp} isRe={true} />
      <Column Comp={Comp} isRe={false} />
    </Grid.Row>
  );
}

export default function NonPenalty(): ReactElement {
  return (
    <>
      <Segment vertical>
        <Grid columns={2} relaxed='very' className='tinyVertical'>
          <Row Comp={Announcements} />
          <Row Comp={ExtraPoints} />
          <Row Comp={SidePlayers} />
          <Row Comp={GamePips} />
          <Row Comp={Points} />
        </Grid>
        <Divider vertical>VS</Divider>
      </Segment>
      <UndecidedPlayers />
      <GameCalcBlame />
    </>
  );
}

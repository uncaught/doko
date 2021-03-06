import React, {ReactElement} from 'react';
import {Divider, Grid, Segment} from 'semantic-ui-react';
import UndecidedPlayers from './UndecidedPlayers';
import GameCalcBlame from './GameCalcBlame';
import Announcements from './Announcements';
import ExtraPoints from './ExtraPoints';
import SidePlayers from './SidePlayers';
import GamePips from './GamePips';
import Points from './Points';
import {useDrop} from 'react-dnd';
import {useSelectGamePlayerSide} from './SelectGamePlayerSide';
import {DndProvider} from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

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
  return <div className={'column'} ref={drop}>
    <Comp isRe={isRe} />
  </div>;
}

function Row({Comp}: {Comp: React.FC<{isRe: boolean}>}): ReactElement {
  return <Grid.Row>
    <Column Comp={Comp} isRe={true} />
    <Column Comp={Comp} isRe={false} />
  </Grid.Row>;
}

export default function NonPenalty(): ReactElement {
  return <>
    <DndProvider options={HTML5toTouch}>
      <Segment vertical>
        <Grid columns={2} relaxed='very' className="tinyVertical">
          <Row Comp={Announcements} />
          <Row Comp={ExtraPoints} />
          <Row Comp={SidePlayers} />
          <Row Comp={GamePips} />
          <Row Comp={Points} />
        </Grid>
        <Divider vertical>VS</Divider>
      </Segment>
      <UndecidedPlayers />
    </DndProvider>
    <GameCalcBlame />
  </>;
}

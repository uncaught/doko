import React, {Fragment, ReactElement, useCallback, useEffect, useState} from 'react';
import {Button, Checkbox, Form, Header, Icon, Label, Modal, Segment} from 'semantic-ui-react';
import {useRoundParticipatingPlayers} from '../../store/Players';
import {useGame, usePatchGame} from '../../store/Games';
import {useGroupMembers} from '../../store/GroupMembers';
import NumberStepper from '../../components/NumberStepper';
import PointsLabel from '../../components/PointsLabel';

export default function Penalty(): ReactElement {
  const {data} = useGame()!;
  const patchGame = usePatchGame();
  const members = useGroupMembers();
  const roundParticipatingPlayers = useRoundParticipatingPlayers();
  const penaltyMemId = data.gameTypeMemberId;
  const allOtherPlayerIds = roundParticipatingPlayers.map(({groupMemberId}) => groupMemberId)
                                                     .filter((id) => id !== penaltyMemId);
  const contraLength = data.contra.members.length;
  const gameOtherPlayerIds = data.players.filter((id) => id !== penaltyMemId);
  const [open, setOpen] = useState(false);

  const getPoints = useCallback(() => (data.gamePoints * contraLength), [data.gamePoints, contraLength]);
  const [points, setPoints] = useState<number>(getPoints);
  const [error, setError] = useState(false);
  useEffect(() => {
    setPoints(getPoints());
  }, [getPoints]);

  return <>
    <Segment vertical>
      <Header>Regelverstoß von {members[data.gameTypeMemberId!].name}</Header>
      <Form>
        <Form.Field>
          <Checkbox
            radio
            label={<label>Nur {contraLength === 1
              ? <b>{members[data.contra.members[0]].name}</b>
              : `ein Solospieler`} erhält positive Punkte</label>}
            name="penaltyDivision"
            value="solo"
            checked={contraLength === 1}
            onChange={() => setOpen(true)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label="Nur die 3 Gegenspieler dieses Spiels erhalten positive Punkte"
            name="penaltyDivision"
            value="game"
            checked={contraLength === 3}
            onChange={() => patchGame({data: {contra: {members: gameOtherPlayerIds}}})}
          />
        </Form.Field>
        {roundParticipatingPlayers.length > 4 && <>
          <Form.Field>
            <Checkbox
              radio
              label={`Alle ${allOtherPlayerIds.length} Gegenspieler dieser Runde erhalten positive Punkte`}
              name="penaltyDivision"
              value="all"
              checked={contraLength === allOtherPlayerIds.length}
              onChange={() => patchGame({data: {contra: {members: allOtherPlayerIds}}})}
            />
          </Form.Field>
        </>}

        <NumberStepper label={'Strafpunkte'}
                       min={1}
                       max={99}
                       error={error}
                       value={points}
                       step={contraLength}
                       onChange={(value) => {
                         setPoints(value);
                         if (value <= 0) {
                           setError(true);
                         } else {
                           if (value % contraLength) {
                             setError(true);
                           } else {
                             patchGame({data: {gamePoints: Math.floor(value / contraLength)}});
                             setError(false);
                           }
                         }
                       }}/>

        <p>Die Strafpunkte müssen unter den Gegenspielern aufteilbar sein.</p>
      </Form>

      <Modal open={open} onClose={() => setOpen(false)} basic size="small">
        <Header>
          <Icon name={'male'}/>
          Solo-Spieler gegen den der Regelverstoß begangen wurde
        </Header>
        <Modal.Content className="u-flex-row-around u-flex-wrap">
          {gameOtherPlayerIds.map((id) => <p key={id}>
            <Button inverted onClick={() => {
              patchGame({data: {contra: {members: [id]}}});
              setOpen(false);
            }}><Icon name="user"/> {members[id].name}</Button>
          </p>)}
        </Modal.Content>
      </Modal>
    </Segment>

    <Segment vertical>
      <div className={'penalty-points-grid'}>
        {roundParticipatingPlayers.map(({groupMemberId}) => {
          const isRe = data.re.members.includes(groupMemberId);
          const isContra = data.contra.members.includes(groupMemberId);
          return <Fragment key={groupMemberId}>
            <div className="memberDetail">
              <Label onClick={() => setOpen(true)}>
                {members[groupMemberId].name} <Icon name={'user'}/>
              </Label>
            </div>
            <PointsLabel
              green={isContra}
              points={isRe ? -data.gamePoints * contraLength : (isContra ? data.gamePoints : 0)}
              red={isRe}
            />
          </Fragment>;
        })}
      </div>
    </Segment>
  </>;
}

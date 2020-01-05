import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {Checkbox, Form, Segment} from 'semantic-ui-react';
import {useGroup} from '../../store/Groups';
import {useActivePlayers} from '../../store/Players';
import {useGame, useGamePlayers, usePatchGame} from '../../store/Games';

export default function Penalty(): ReactElement {
  const {settings: {dividePenalties}} = useGroup()!;
  const {data} = useGame()!;
  const patchGame = usePatchGame();
  const activePlayers = useActivePlayers();
  const gamePlayers = useGamePlayers()!;
  const penaltyMemId = data.gameTypeMemberId;
  const allOtherPlayerIds = activePlayers.map(({groupMemberId}) => groupMemberId).filter((id) => id !== penaltyMemId);
  const affectsFullRound = data.contra.members.length === allOtherPlayerIds.length;
  const gameOtherPlayerIds = gamePlayers.all.map(({member}) => member.id).filter((id) => id !== penaltyMemId);

  const factor = affectsFullRound ? allOtherPlayerIds.length : 3;

  const getPoints = useCallback(() => (dividePenalties ? data.gamePoints * factor : data.gamePoints).toString(),
    [data.gamePoints, dividePenalties, factor]);
  const [points, setPoints] = useState<string>(getPoints);
  const [error, setError] = useState(false);
  useEffect(() => {
    setPoints(getPoints());
  }, [getPoints]);

  return <>
    <Segment vertical>
      <Form>
        <Form.Input label={'Strafpunkte'}
                    type={'number'}
                    error={error}
                    step={dividePenalties ? factor : undefined}
                    value={points}
                    onChange={(_, {value: v}) => {
                      setPoints(v);
                      const correctedValue = Math.floor(+v);
                      if (dividePenalties) {
                        if (correctedValue % factor) {
                          setError(true);
                        } else {
                          patchGame({data: {gamePoints: Math.floor(correctedValue / factor)}});
                          setError(false);
                        }
                      } else {
                        patchGame({data: {gamePoints: correctedValue}});
                        setError(false);
                      }
                    }}/>

        {dividePenalties && <>
          {activePlayers.length > 4 && <>
            <Form.Field>
              <Checkbox
                radio
                label='Nur die 3 Gegenspieler dieses Spiels erhalten positive Punkte'
                name='penaltyDivision'
                value='game'
                checked={!affectsFullRound}
                onChange={() => patchGame({data: {contra: {members: gameOtherPlayerIds}}})}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label={`Alle ${allOtherPlayerIds.length} Gegenspieler dieser Runde erhalten positive Punkte`}
                name='penaltyDivision'
                value='all'
                checked={affectsFullRound}
                onChange={() => patchGame({data: {contra: {members: allOtherPlayerIds}}})}
              />
            </Form.Field>
          </>}
        </>}
      </Form>
    </Segment>
  </>;
}

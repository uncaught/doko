import React, {Fragment, ReactElement, useState} from 'react';
import {Checkbox, Form, Icon, Input, Label, Segment, TextArea} from 'semantic-ui-react';
import {InputOnChangeData} from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import {useGame, usePatchGame, useSortedGames} from '../../store/Games';
import {useGroupMembers} from '../../store/GroupMembers';
import {useRoundParticipatingPlayers} from '../../store/Players';

export default function ManualInput(): ReactElement {
  const {data, id} = useGame()!;
  const patchGame = usePatchGame();
  const members = useGroupMembers();
  const players = useRoundParticipatingPlayers();
  const sortedGames = useSortedGames();
  const gameIndex = sortedGames.findIndex((game) => game.id === id);
  const prevGame = sortedGames[gameIndex - 1];

  const [comment, setComment] = useState(data.manualInput?.comment ?? '');
  const [dealAgain, setDealAgain] = useState(data.manualInput?.dealAgain ?? false);
  const [points, _setPoints] = useState<Record<string, string>>(() => {
    const current = Object.fromEntries((data.manualInput?.points ?? []).map(({player, points}) => [player, points]));
    return Object.fromEntries(players.map(({groupMemberId}) => [groupMemberId, '' + (current[groupMemberId] ?? 0)]));
  });
  const sum = Object.values(points).reduce((acc, p) => acc + +p, 0);

  const setPoints =
    (id: string) =>
    (_: React.ChangeEvent<HTMLInputElement>, {value}: InputOnChangeData) => {
      _setPoints((cur) => ({...cur, [id]: value}));
    };

  return (
    <>
      <Segment vertical>
        <div className={'manual-points-grid'}>
          {players.map(({groupMemberId}) => {
            return (
              <Fragment key={groupMemberId}>
                <div className='memberDetail'>
                  <Label>
                    {members[groupMemberId]!.name} <Icon name={'user'} />
                  </Label>
                </div>
                <Input
                  disabled={data.isComplete}
                  type={'number'}
                  error={sum !== 0}
                  value={points[groupMemberId]}
                  onChange={setPoints(groupMemberId)}
                />
              </Fragment>
            );
          })}
          <div className='memberDetail'>
            <Label active>Summe</Label>
          </div>
          <Input disabled type={'number'} error={sum !== 0} value={sum} />
        </div>
      </Segment>

      {!!prevGame && (
        <Segment vertical>
          <Form>
            <Form.Field>
              <Checkbox
                disabled={data.isComplete}
                label={`${members[prevGame.dealerGroupMemberId]!.name} gibt erneut aus`}
                checked={dealAgain}
                onClick={() => !data.isComplete && setDealAgain(!dealAgain)}
              />
            </Form.Field>
          </Form>
        </Segment>
      )}

      <Segment vertical>
        <Form>
          <Form.Field>
            <TextArea
              placeholder={'Kommentar'}
              disabled={data.isComplete}
              value={comment}
              onChange={(_, {value}) => setComment((value as string) ?? '')}
            />
          </Form.Field>
        </Form>
      </Segment>

      {!data.isComplete && (
        <Segment vertical>
          <Form.Button
            disabled={sum !== 0}
            onClick={() =>
              patchGame({
                data: {
                  isComplete: true,
                  manualInput: {
                    comment,
                    dealAgain,
                    points: Object.entries(points).map(([player, points]) => ({player, points: +points})),
                  },
                },
              })
            }
          >
            Abschließen
          </Form.Button>
        </Segment>
      )}
    </>
  );
}

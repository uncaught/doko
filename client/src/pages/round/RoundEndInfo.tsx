import React, {ReactElement, useState} from 'react';
import {Button, Divider, Form, Header, Icon, Label, Modal} from 'semantic-ui-react';
import {usePatchRound, useRound} from '../../store/Rounds';
import NumberStepper from '../../components/NumberStepper';
import {useSortedGames} from '../../store/Games';

export default function RoundEndInfo(): ReactElement {
  const {data} = useRound()!;
  const patchRound = usePatchRound();
  const sortedGames = useSortedGames();
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(1);
  const lastGameRunNumber = sortedGames.length ? sortedGames[sortedGames.length - 1].data.runNumber : 1;
  const endKnown = !data.dynamicRoundDuration || data.roundDuration !== null;
  const duration = data.dynamicRoundDuration ? data.roundDuration : 6;

  return <>
    <div className="memberDetail">
      {endKnown && <Label color={'yellow'} onClick={() => setOpen(true)}>
        Ende nach {duration} Durchgängen <Icon name={'sync alternate'}/>
      </Label>}

      {!endKnown && <Label color={'yellow'} onClick={() => setOpen(true)}>
        Ende noch nicht gemeldet <Icon name={'warning'}/>
      </Label>}
    </div>

    <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
      <Header>
        <Icon name={'sync alternate'}/>
        Spielende
      </Header>
      <Modal.Content>
        <p>
          Wir befinden uns derzeit in Durchgang {lastGameRunNumber}.
        </p>

        {endKnown && <>
          <p>
            Das Spiel endet nach {duration} Durchgängen.
          </p>
        </>}

        {data.dynamicRoundDuration && <>
          <Divider section/>

          <Form className="u-flex-row-around u-align-center">
            <Form.Field>
              Noch
            </Form.Field>
            <NumberStepper value={remaining} min={1} onChange={setRemaining} inverted/>
            <Form.Field>
              volle Durchgänge
            </Form.Field>
          </Form>
        </>}
      </Modal.Content>
      {data.dynamicRoundDuration && <Modal.Actions>
        <Button inverted onClick={() => {
          patchRound({data: {roundDuration: lastGameRunNumber + remaining}});
          setOpen(false);
        }}>
          <Icon name='checkmark'/> Ok
        </Button>
      </Modal.Actions>}
    </Modal>
  </>;
}

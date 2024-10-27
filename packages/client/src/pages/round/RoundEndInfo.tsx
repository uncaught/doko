import React, {ReactElement, useState} from 'react';
import {Icon, Label, Modal} from 'semantic-ui-react';
import {useRound} from '../../store/Rounds';
import RoundEndInfoPopup from './RoundEndInfoPopup';

export default function RoundEndInfo(): ReactElement | null {
  const {data, endDate} = useRound()!;
  const [open, setOpen] = useState(false);
  if (endDate) {
    //Do not display this label if the round has ended. The `data.roundDuration` might not be accurate in case of
    // a premature ending.
    return null;
  }
  const endKnown = !data.dynamicRoundDuration || data.roundDuration !== null;
  const duration = data.dynamicRoundDuration ? data.roundDuration : 6;

  return (
    <>
      <div className='memberDetail'>
        {endKnown && (
          <Label color={'yellow'} onClick={() => setOpen(true)}>
            Ende nach {duration} Durchgängen <Icon name={'sync alternate'} />
          </Label>
        )}

        {!endKnown && (
          <Label color={'yellow'} onClick={() => setOpen(true)}>
            Ende noch nicht gemeldet <Icon name={'warning'} />
          </Label>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} basic size='small' closeIcon>
        <RoundEndInfoPopup duration={duration} endKnown={endKnown} setOpen={setOpen} />
      </Modal>
    </>
  );
}

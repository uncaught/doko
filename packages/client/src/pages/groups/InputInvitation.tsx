import React, {ReactElement, useState} from 'react';
import {Button, Header, Icon, Input, Modal} from 'semantic-ui-react';
import {useAcceptInvitation} from '../../store/GroupMembers';

export default function InputInvitation(): ReactElement {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const acceptInvitation = useAcceptInvitation();

  return (
    <>
      <Button icon floated='right' labelPosition='left' color={'blue'} onClick={() => setShow(true)}>
        <Icon name='linkify' />
        Eingabe
      </Button>

      {show && (
        <Modal
          className='scanInvitation-modal'
          open={show}
          dimmer={'inverted'}
          onClose={() => setShow(false)}
          basic
          closeIcon
          size='small'
        >
          <Header icon='linkify' content='Einladungs-URL' />
          <Modal.Content>
            <Input
              error={error}
              onChange={async (event, {value}) => {
                setError(false);
                if (value && !(await acceptInvitation(value))) {
                  //this will already navigate away and thus close the dialog
                  setError(true);
                }
              }}
              fluid
              focus
            />
          </Modal.Content>
        </Modal>
      )}
    </>
  );
}

import React, {ReactElement, useState} from 'react';
import {Button, Header, Icon, Message, Modal} from 'semantic-ui-react';
import {useAcceptInvitation} from '../../store/GroupMembers';
import QrReader from './QrReader';

export default function ScanInvitation(): ReactElement {
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const acceptInvitation = useAcceptInvitation();

  return <>
    <Button icon floated='right' labelPosition='left' color={'blue'} onClick={() => setShow(true)}>
      <Icon name='qrcode'/>
      QR-Code
    </Button>

    {show && <Modal className='scanInvitation-modal'
                    open={show}
                    dimmer={'inverted'}
                    onClose={() => setShow(false)}
                    basic
                    closeIcon
                    size='small'>
      <Header icon='camera' content='Scanning ...'/>
      <Modal.Content>
        <QrReader
          onResult={async (result, error) => {
            if (error) {
              console.error(error);
              setError(error.message || error.name || 'unknown error');
            } else if (result) {
              const text = result.getText();
              if (text) {
                await acceptInvitation(text); //this will already navigate away and thus close the dialog
              }
            }
          }}
        />
      </Modal.Content>
      {!!error && <Modal.Actions>
        <Message negative>{error}</Message>
      </Modal.Actions>}
    </Modal>}
  </>;
}

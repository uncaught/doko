import React, {ReactElement, useCallback, useState} from 'react';
import {Button, Header, Icon, Message, Modal} from 'semantic-ui-react';
import QrReader from 'react-qr-reader';
import {useAcceptInvitation} from '../../store/GroupMembers';

export default function ScanInvitation(): ReactElement {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const acceptInvitation = useAcceptInvitation();

  const onScan = useCallback(async (data: string | null) => {
    if (data) {
      await acceptInvitation(data); //this will already navigate away and thus close the dialog
    }
  }, [acceptInvitation]);

  return <>
    <Button icon floated='right' labelPosition='left' color={'blue'} onClick={() => setShow(true)}>
      <Icon name='qrcode'/>
      QR-Code
    </Button>

    {show && <Modal className="scanInvitation-modal"
                    open={show}
                    dimmer={'inverted'}
                    onClose={() => setShow(false)}
                    basic
                    closeIcon
                    size='small'>
      <Header icon='camera' content='Scanning ...'/>
      <Modal.Content>
        <QrReader
          delay={300}
          onError={setError}
          onScan={onScan}
          style={{width: '100%'}}
        />
      </Modal.Content>
      {!!error && <Modal.Actions>
        <Message negative>{error.message || error}</Message>
      </Modal.Actions>}
    </Modal>}
  </>;
}

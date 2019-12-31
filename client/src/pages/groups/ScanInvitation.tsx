import React, {ReactElement, useCallback, useState} from 'react';
import {Button, Header, Icon, Message, Modal} from 'semantic-ui-react';
import QrReader from 'react-qr-reader';
import {useAcceptInvitation} from '../../Store/GroupMembers';

export default function ScanInvitation(): ReactElement {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const acceptInvitation = useAcceptInvitation();

  const onScan = useCallback(async (data: string | null) => {
    if (data && await acceptInvitation(data)) {
      setShow(false);
    }
  }, [acceptInvitation]);

  return <section className="u-relative u-overflow-hidden">
    <Header as='h4'>Scanne einen Einladungs-Code</Header>

    <Button icon floated='right' labelPosition='left' color={'blue'} onClick={() => setShow(true)}>
      <Icon name='qrcode'/>
      Scan
    </Button>

    {show && <Modal className="scanInvitation-modal"
                    open={show}
                    dimmer={'inverted'}
                    onClose={() => setShow(false)}
                    basic
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
      <Modal.Actions>
        <Button basic onClick={() => setShow(false)}>
          <Icon name='cancel'/> Cancel
        </Button>
        {!!error && <Message negative>{error.message || error}</Message>}
      </Modal.Actions>
    </Modal>}
  </section>;
}

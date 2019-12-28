import React, {ReactElement, useCallback, useState} from 'react';
import {Button, Header, Icon, Message, Modal} from 'semantic-ui-react';
import QrReader from 'react-qr-reader';
import {useAcceptInvitation} from '../../Store/GroupMembers';

export default function ScanInvitation(): ReactElement {
  const [show, setShow] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const acceptInvitation = useAcceptInvitation();

  const onScan = useCallback((data: string | null) => {
    if (data && acceptInvitation(data)) {
      setShow(false);
    }
  }, [acceptInvitation]);

  return <div>
    <Header>Scanne einen Einladungs-Code</Header>
    <Button onClick={() => setShow(true)}>Scan</Button>
    {show && <Modal className={'scanInvitation-modal'} open={show} onClose={() => setShow(false)} basic size='small'>
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
        <Button basic color='red' inverted onClick={() => setShow(false)}>
          <Icon name='cancel'/> Cancel
        </Button>
        {!!error && <Message negative>{error.message || error}</Message>}
      </Modal.Actions>
    </Modal>}
  </div>;
}

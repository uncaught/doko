import React, {ReactElement, useState} from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import QrReader from 'react-qr-reader';

export default function ScanInvitation(): ReactElement {
  const [show, setShow] = useState(false);
  // const addGroup = useAddGroup();
  // const history = useHistory();

  // const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const name = formData.get('name') as string;
  //   event.currentTarget.reset();
  //   const groupId = addGroup(name);
  //   history.push(`/group/${groupId}/members`);
  // }, [addGroup, history]);

  return <div>
    <Header>Scanne einen Einladungs-Code</Header>
    <Button onClick={() => setShow(true)}>Scan</Button>
    {show && <Modal className={'scanInvitation-modal'} open={show} onClose={() => setShow(false)} basic size='small'>
      <Header icon='camera' content='Scanning ...'/>
      <Modal.Content>
        <QrReader
          delay={300}
          onError={(err) => console.error({err})}
          onScan={(data) => console.error({data})}
          style={{width: '100%'}}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button basic color='red' inverted onClick={() => setShow(false)}>
          <Icon name='cancel'/> Cancel
        </Button>
      </Modal.Actions>
    </Modal>}
  </div>;
}

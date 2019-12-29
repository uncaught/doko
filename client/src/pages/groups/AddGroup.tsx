import React, {FormEvent, ReactElement, useCallback} from 'react';
import {Form, Header} from 'semantic-ui-react';
import {useAddGroup} from '../../Store/Groups';
import {useHistory} from 'react-router-dom';

export default function AddGroup(): ReactElement {
  const addGroup = useAddGroup();
  const history = useHistory();

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    event.currentTarget.reset();
    const groupId = addGroup(name);
    history.push(`/group/${groupId}/members`);
  }, [addGroup, history]);

  return <section>
    <Form onSubmit={onSubmit}>
      <Header as='h4'>Lege eine neue Gruppe an</Header>
      <Form.Group>
        <Form.Field>
          <Form.Input name={'name'} maxLength={191} required placeholder={'Gruppenname'}/>
        </Form.Field>
        <Form.Field>
          <Form.Button color={'green'} type={'submit'}>Anlegen</Form.Button>
        </Form.Field>
      </Form.Group>
    </Form>
  </section>;
}

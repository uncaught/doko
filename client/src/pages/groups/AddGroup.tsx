import React, {FormEvent, ReactElement, useCallback} from 'react';
import {Form, Header} from 'semantic-ui-react';
import {useAddGroup} from '../../store/Groups';

export default function AddGroup(): ReactElement {
  const addGroup = useAddGroup();

  const onSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    event.currentTarget.reset();
    addGroup(name);
  }, [addGroup]);

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

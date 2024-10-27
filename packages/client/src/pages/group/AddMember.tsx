import React, {FormEvent, ReactElement, useCallback} from 'react';
import {Form, Header} from 'semantic-ui-react';
import {useAddGroupMember} from '../../store/GroupMembers';

export default function AddMember(): ReactElement {
  const addMember = useAddGroupMember();

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      event.currentTarget.reset();
      addMember(name);
    },
    [addMember],
  );

  return (
    <section>
      <Form onSubmit={onSubmit}>
        <Header as='h4'>Füge ein neues Mitglied hinzu</Header>
        <Form.Group>
          <Form.Field>
            <Form.Input name={'name'} maxLength={191} required placeholder={'Name'} focus />
          </Form.Field>
          <Form.Field>
            <Form.Button color={'green'} type={'submit'} icon={'plus'} />
          </Form.Field>
        </Form.Group>
      </Form>
    </section>
  );
}

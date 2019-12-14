import React, {FormEvent, ReactElement} from 'react';
import {useSelector} from 'react-redux';
import {groupsSelector} from 'src/store/groups';
import {Form} from 'semantic-ui-react';

export default function (): ReactElement {
  const groups = useSelector(groupsSelector);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');

    event.currentTarget.reset();
  };

  return <div>
    <div>
      {groups.map(({id, name}) => <div key={id}>{name}</div>)}
    </div>

    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field>
          <label>Neue Gruppe</label>
          <Form.Input name={'name'} maxLength={191} required/>
          <Form.Button color={'blue'} type={'submit'}>Anlegen</Form.Button>
        </Form.Field>
      </Form.Group>
    </Form>
  </div>;
}

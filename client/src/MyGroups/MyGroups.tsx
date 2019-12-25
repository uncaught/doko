import React, {FormEvent, ReactElement} from 'react';
import {Form} from 'semantic-ui-react';
import {useAddGroup, useSortedGroups} from 'src/Hooks/Hooks';

export default function (): ReactElement {
  const [, groups] = useSortedGroups();
  const addGroup = useAddGroup();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    event.currentTarget.reset();
    await addGroup(name);
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

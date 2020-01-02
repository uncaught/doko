import React, {ReactElement, useEffect, useState} from 'react';
import {Form, InputOnChangeData} from 'semantic-ui-react';
import {useGroup, usePatchGroup} from '../../../Store/Groups';

export default function Name(): ReactElement {
  const group = useGroup();
  const patch = usePatchGroup();
  const [error, setError] = useState(false);
  const [name, setName] = useState(group ? group.name : '');
  useEffect(() => group && setName(group.name), [group]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setName(data.value);
    if (data.value) {
      setError(false);
    }
  };

  const save = () => {
    if (name) {
      patch({name});
    } else {
      setError(true);
    }
  };

  return <Form.Input error={error}
                     value={name}
                     onChange={onChange}
                     onBlur={save}
                     onKeyPress={(e: KeyboardEvent) => {
                       if (e.key === 'Enter') {
                         save();
                       }
                     }}
                     maxLength={191}
                     placeholder={'Gruppenname'}
                     label={'Gruppenname'}
                     size={'small'}
                     required/>;
}

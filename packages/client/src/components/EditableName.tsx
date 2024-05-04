import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {Header, Icon, Input, InputOnChangeData, SemanticICONS} from 'semantic-ui-react';

interface EditableNameProps<T extends {name: string}> {
  icon: SemanticICONS;
  useGet: () => T | undefined;
  usePatch: () => (patch: {name: string}) => void;
}

export default function EditableName<T extends {name: string}>({
  icon,
  useGet,
  usePatch,
}: EditableNameProps<T>): ReactElement {
  const entity = useGet();
  const patchEntity = usePatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState(entity ? entity.name : '');
  useEffect(() => entity && setName(entity.name), [entity]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setName(data.value);
    if (data.value) {
      setError(false);
    }
  };

  const save = () => {
    if (name) {
      setEditing(false);
      patchEntity({name});
    } else {
      setError(true);
    }
  };

  return <div className='u-flex-row-between editableNameHeader'>
    {!editing && <>
      <Header as={'h2'}><Icon name={icon} size={'small'}/> {name}</Header>
      <Icon name={'edit'} onClick={() => {
        setEditing(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
          }
        }, 100);
      }}/>
    </>}
    {editing && <>
      <Input error={error}
             ref={inputRef}
             value={name}
             onChange={onChange}
             onBlur={save}
             onKeyPress={(e: KeyboardEvent) => {
               if (e.key === 'Enter') {
                 save();
               }
             }}
             maxLength={191}
             placeholder={'Name'}
             size={'small'}
             required/>
    </>}
  </div>;
}

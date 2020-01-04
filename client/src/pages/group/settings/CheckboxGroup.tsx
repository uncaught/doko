import React, {ReactElement} from 'react';
import {Form, Label, Segment} from 'semantic-ui-react';
import {useGroup, usePatchGroup} from '../../../store/Groups';
import {GroupSettings, SubType} from '@doko/common';
import {CheckboxProps} from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';

interface CheckboxGroupProps {
  label: string;
  options: Map<string, string>;
  parentKey: keyof SubType<GroupSettings, { [x: string]: boolean }>;
}

export default function CheckboxGroup({label, parentKey, options}: CheckboxGroupProps): ReactElement | null {
  const group = useGroup();
  const patch = usePatchGroup();
  if (!group) {
    return null;
  }
  const bools = group.settings[parentKey] as { [x: string]: boolean };
  return <Segment>
    <Label attached={'top'}>{label}</Label>
    <Form.Group className={'attached'}>
      {[...options].map(([key, text]) =>
        <Form.Checkbox key={`${parentKey}.${key}`}
                       checked={bools[key]}
                       onChange={(
                         event: React.FormEvent<HTMLInputElement>,
                         {checked}: CheckboxProps,
                       ) => patch({settings: {[parentKey]: {[key]: !!checked}}})}
                       label={text}
                       size={'small'}/>)}
    </Form.Group>
  </Segment>;
}

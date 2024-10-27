import {GroupSettings, SubType} from '@doko/common';
import React, {ReactElement} from 'react';
import {Form, Label, Segment} from 'semantic-ui-react';
import Checkbox from './Checkbox';

interface CheckboxGroupProps {
  label: string;
  options: Map<string, string>;
  parentKey: keyof SubType<GroupSettings, {[x: string]: boolean}>;
}

export default function CheckboxGroup({label, parentKey, options}: CheckboxGroupProps): ReactElement | null {
  return (
    <Segment>
      <Label attached={'top'}>{label}</Label>
      <Form.Group unstackable>
        {[...options].map(([key, text]) => (
          <Checkbox key={`${parentKey}.${key}`} path={`${parentKey}.${key}`} label={text} />
        ))}
      </Form.Group>
    </Segment>
  );
}

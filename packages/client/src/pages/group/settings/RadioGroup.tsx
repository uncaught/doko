import {GroupSettings, SubType} from '@doko/common';
import React, {ReactElement} from 'react';
import {Form, Label, Segment} from 'semantic-ui-react';
import {useGroup, usePatchGroup} from '../../../store/Groups';

interface RadioGroupProps {
  label: string;
  options: Map<string, string>;
  parentKey: keyof SubType<Required<GroupSettings>, string>;
}

export default function RadioGroup({label, parentKey, options}: RadioGroupProps): ReactElement | null {
  const group = useGroup()!;
  const patch = usePatchGroup();
  const groupValue = group.settings[parentKey];
  return <Segment>
    <Label attached={'top'}>{label}</Label>
    <Form.Group className={'attached'}>
      {[...options].map(([value, text]) =>
        <Form.Radio key={`${parentKey}.${value}`}
                    value={value}
                    checked={groupValue === value}
                    onChange={() => patch({settings: {[parentKey]: value}})}
                    label={text}
                    size={'small'}/>)}
    </Form.Group>
  </Segment>;
}

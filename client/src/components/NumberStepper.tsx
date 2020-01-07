import React, {ReactElement} from 'react';
import {Button, Form, Input} from 'semantic-ui-react';

interface NumberStepperProps {
  label?: string;
  min?: number;
  max?: number;
  inverted?: boolean;
  value: number;
  onChange: (n: number) => void;
}

export default function NumberStepper({label, min, max = 9, onChange, value, inverted}: NumberStepperProps): ReactElement | null {
  const w = max > 9 ? 3 : 2;
  return <Form.Field inline>
    {!!label && <label>{label}</label>}
    <Input type={'number'}
           min={min}
           max={max}
           value={value || 0}
           step={1}
           onChange={(_, {value}) => onChange(Math.ceil(+value))}>
      <Button inverted={inverted} attached='left' icon={'minus'} onClick={() => {
        if (typeof min !== 'number' || value > min) {
          onChange(value - 1);
        }
      }}/>
      <input style={{width: `calc(${w}ch + 2em)`, textAlign: 'center'}}/>
      <Button inverted={inverted} attached='right' icon={'plus'} onClick={() => onChange(value + 1)}/>
    </Input>
  </Form.Field>;
}

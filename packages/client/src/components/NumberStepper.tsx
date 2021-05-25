import React, {ReactElement} from 'react';
import {Button, Form, Input} from 'semantic-ui-react';

interface NumberStepperProps {
  error?: boolean;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  inverted?: boolean;
  value: number;
  onChange: (n: number) => void;
}

export default function NumberStepper({error, label, min, max, step = 1, onChange, value, inverted}: NumberStepperProps): ReactElement | null {
  const w = typeof max === 'number' && max > 9 ? 3 : 2;
  return <Form.Field inline>
    {!!label && <label>{label}</label>}
    <Input type={'number'}
           error={error}
           min={min}
           max={max}
           value={value || 0}
           step={step}
           onChange={(_, {value}) => onChange(Math.ceil(+value))}>
      <Button inverted={inverted} attached='left' icon={'minus'} onClick={() => {
        if (typeof min !== 'number' || (value - step) >= min) {
          onChange(value - step);
        }
      }}/>
      <input style={{width: `calc(${w}ch + 2em)`, textAlign: 'center'}}/>
      <Button inverted={inverted} attached='right' icon={'plus'} onClick={() => {
        if (typeof max !== 'number' || (value + step) <= max) {
          onChange(value + step);
        }
      }}/>
    </Input>
  </Form.Field>;
}

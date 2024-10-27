import {get, set} from 'lodash';
import React, {ReactElement} from 'react';
import {CheckboxProps, Form} from 'semantic-ui-react';
import {useGroup, usePatchGroup} from '../../../store/Groups';

export default function Checkbox({label, path}: {label: string; path: string}): ReactElement | null {
  const group = useGroup()!;
  const patch = usePatchGroup();
  const checked = get(group.settings, path) as boolean;
  return (
    <Form.Checkbox
      checked={checked}
      onChange={(event: React.FormEvent<HTMLInputElement>, {checked}: CheckboxProps) =>
        patch({settings: set({}, path, !!checked)})
      }
      label={label}
      size={'small'}
    />
  );
}

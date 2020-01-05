import React, {ReactElement} from 'react';
import {Form} from 'semantic-ui-react';
import {useGroup, usePatchGroup} from '../../../store/Groups';
import {soloTypeOptions, SoloType} from '@doko/common';

export default function AllowedSoloTypes(): ReactElement | null {
  const group = useGroup()!;
  const patch = usePatchGroup();
  return <Form.Dropdown placeholder='Erlaubte Soli'
                        fluid
                        multiple
                        label="Erlaubte Soli"
                        selection
                        onChange={(e, {value}) => patch({settings: {allowedSoloTypes: value as SoloType[]}})}
                        options={soloTypeOptions}
                        value={group.settings.allowedSoloTypes}/>;
}

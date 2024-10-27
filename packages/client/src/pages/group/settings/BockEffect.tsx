import {bockEffectOptions, GroupSettings} from '@doko/common';
import React, {ReactElement} from 'react';
import {Form} from 'semantic-ui-react';
import NumberStepper from '../../../components/NumberStepper';
import {useGroup, usePatchGroup} from '../../../store/Groups';

export default function BockEffect(): ReactElement | null {
  const group = useGroup()!;
  const patch = usePatchGroup();
  return (
    <>
      <Form.Dropdown
        label={'Bockspiel-Effekt'}
        options={bockEffectOptions}
        value={group.settings.bockEffect}
        onChange={(e, {value}) => patch({settings: {bockEffect: value as GroupSettings['bockEffect']}})}
        selection
      />
      {group.settings.bockEffect === 'extraPoints' && (
        <NumberStepper
          min={1}
          label={'Bockpunkte'}
          value={group.settings.bockEffectExtraPoints}
          onChange={(n) => patch({settings: {bockEffectExtraPoints: n}})}
        />
      )}
    </>
  );
}

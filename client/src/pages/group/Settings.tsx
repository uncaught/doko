import React, {ReactElement} from 'react';
import {Dropdown, Header} from 'semantic-ui-react';
import {useGroup, usePatchGroup} from '../../Store/Groups';
import {soloOptions, SoloType} from '@doko/common';

export default function Settings(): ReactElement | null {
  const group = useGroup();
  const patch = usePatchGroup();

  if (!group) {
    return null;
  }

  return <section>
    <Header as='h4'>Einstellungen / Regeln</Header>

    <Header as='h6'>Erlaubte Soli</Header>
    <Dropdown placeholder='Erlaubte Soli'
              fluid
              multiple
              selection
              onChange={(e, {value}) => patch({settings: {allowedSoloTypes: value as SoloType[]}})}
              options={soloOptions}
              value={group.settings.allowedSoloTypes}/>

  </section>;
}

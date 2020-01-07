import React, {ReactElement} from 'react';
import {Divider, Form, Header} from 'semantic-ui-react';
import Name from './settings/Name';
import AllowedSoloTypes from './settings/AllowedSoloTypes';
import CheckboxGroup from './settings/CheckboxGroup';
import {bockGamesTranslations, bockInBockBehaviorOptions, extraPointsTranslations} from '@doko/common';
import RadioGroup from './settings/RadioGroup';
import BockEffect from './settings/BockEffect';
import {useGroup} from '../../store/Groups';
import Checkbox from './settings/Checkbox';

export default function Settings(): ReactElement | null {
  const {settings} = useGroup()!;
  const hasBock = Object.values(settings.bockGames).some((val) => val);
  return <section>
    <Form>
      <Name/>
      <Checkbox path={`dynamicRoundDuration`} label={'Dynamische Rundenlänge - sonst 24 Spiele'}/>
      <AllowedSoloTypes/>
      <CheckboxGroup label={'Zusatzpunkte bei ...'} options={extraPointsTranslations} parentKey={'extraPoints'}/>

      <Divider section/>

      <section>
        <Header as='h4'>Bock</Header>
        <CheckboxGroup label={'Bockspiele nach ...'} options={bockGamesTranslations} parentKey={'bockGames'}/>
        {hasBock && <>
          <RadioGroup label={'Bei Bock im Bock ...'}
                      options={bockInBockBehaviorOptions}
                      parentKey={'bockInBockBehavior'}/>
          <BockEffect/>
        </>}
      </section>
    </Form>
  </section>;
}

import {bockGamesTranslations, bockInBockBehaviorOptions, extraPointsTranslations} from '@doko/common';
import React, {ReactElement} from 'react';
import {Divider, Form, Header} from 'semantic-ui-react';
import Page from '../../Page';
import {useGroup} from '../../store/Groups';
import AllowedSoloTypes from './settings/AllowedSoloTypes';
import BockEffect from './settings/BockEffect';
import Checkbox from './settings/Checkbox';
import CheckboxGroup from './settings/CheckboxGroup';
import Name from './settings/Name';
import RadioGroup from './settings/RadioGroup';

export default function Settings(): ReactElement | null {
  const {settings} = useGroup()!;
  const hasBock = Object.values(settings.bockGames).some((val) => val);
  return <Page displayName={'Einstellungen'}>
    <section>
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
    </section>
  </Page>;
}

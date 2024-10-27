import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import Page from '../../Page';
import FullPot from './FullPot';
import SplitPotAttendance from './SplitPotAttendance';
import TopUpByAverage from './TopUpByAverage';

export default function PotIndex(): ReactElement | null {
  return (
    <Page displayName={'Pott'}>
      <section>
        <FullPot />
        <Divider section />
        <SplitPotAttendance />
        <Divider section />
        <TopUpByAverage />
      </section>
    </Page>
  );
}

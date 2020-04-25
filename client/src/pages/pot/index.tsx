import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import FullPot from './FullPot';
import SplitPotAttendance from './SplitPotAttendance';
import TopUpByAverage from './TopUpByAverage';

export default function PotIndex(): ReactElement | null {
  return <section>
    <FullPot/>
    <Divider section/>
    <SplitPotAttendance/>
    <Divider section/>
    <TopUpByAverage/>
  </section>;
}

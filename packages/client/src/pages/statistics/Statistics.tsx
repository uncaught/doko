import React, {ReactElement, ReactNode, useState} from 'react';
import {Divider, Dropdown} from 'semantic-ui-react';
import Page from '../../Page';
import GraphStatistic from './GraphStatistic';
import TableStatistic from './TableStatistic';

const statistics = {
  gameTypes: {name: 'Spieltypen', component: <TableStatistic type={'gameTypes'} />},
  soloTypes: {name: 'Soli', component: <TableStatistic type={'soloTypes'} />},
  extraPoints: {name: 'Extrapunkte', component: <TableStatistic type={'extraPoints'} />},
  announces: {name: 'Ansagen', component: <TableStatistic type={'announces'} />},
  missedAnnounces: {name: 'Verpasste Ansagen', component: <TableStatistic type={'missedAnnounces'} />},
  totalBalance: {name: 'Punkteverlauf (gesamt)', component: <GraphStatistic type={'totalBalance'} />},
  roundBalance: {name: 'Punkteverlauf (Runde)', component: <GraphStatistic type={'roundBalance'} />},
} as const satisfies Record<string, {name: string; component: ReactNode}>;

type Option = keyof typeof statistics;

const sorted = [
  'gameTypes',
  'soloTypes',
  'extraPoints',
  'announces',
  'missedAnnounces',
  'totalBalance',
  'roundBalance',
] as const satisfies Option[];

const filterOptions = sorted.map((value) => ({text: statistics[value].name, value}));

export default function Statistics(): ReactElement {
  const [filter, setFilter] = useState<Option>(sorted[5]);

  return (
    <Page displayName={'Statistiken'}>
      <section>
        <Dropdown
          label={'Filter'}
          options={filterOptions}
          value={filter}
          onChange={(_, {value}) => setFilter(value as Option)}
          selection
        />

        <Divider className='tiny' hidden />

        {statistics[filter].component}
      </section>
    </Page>
  );
}

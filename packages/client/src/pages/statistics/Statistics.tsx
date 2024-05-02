import {
  Announces,
  ExtraPoints,
  GameTypes,
  MissedAnnounces,
  SoloType,
  SoloTypes,
  Statistics as Stats,
} from '@doko/common';
import classNames from 'classnames';
import React, {ReactElement, ReactNode, useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {Divider, Dropdown, StrictDropdownItemProps} from 'semantic-ui-react';
import Page from '../../Page';
import {useMemberInitials, useSortedGroupMembers} from '../../store/GroupMembers';
import {useGroup} from '../../store/Groups';
import {statisticsSelector, Ui, useSetUi} from '../../store/Ui';
import EnableIrregularMembersMenuItem from './EnableIrregularMembersMenuItem';
import Value from './Value';
import ValueGrid from './ValueGrid';

const extraPoints = new Map<keyof ExtraPoints, string>();
extraPoints.set('doppelkopf', 'Doppel\u00ADkopf');
extraPoints.set('foxCaught', 'Fuchs gefangen');
extraPoints.set('foxLost', 'Fuchs verloren');
extraPoints.set('karlGotLastTrick', 'Karl\u00ADchen');
extraPoints.set('karlCaught', 'Karl\u00ADchen gefangen');
extraPoints.set('karlLost', 'Karl\u00ADchen verloren');
extraPoints.set('wonAgainstQueensOfClubs', 'Gegen die Alten gewonnen');

const gameTypes = new Map<keyof GameTypes, string>();
gameTypes.set('normal', 'Normal\u00ADspiele');
gameTypes.set('poverty', 'Armut');
gameTypes.set('povertyPartner', 'Armut Partner');
gameTypes.set('povertyOpponent', 'Armut Gegner');
gameTypes.set('wedding', 'Hochzeit');
gameTypes.set('weddingPartner', 'Hoch\u00ADzeit Partner');
gameTypes.set('weddingOpponent', 'vs. Hoch\u00ADzeit');
gameTypes.set('silentWedding', 'Stille Hoch\u00ADzeit');
gameTypes.set('silentWeddingOpponent', 'vs. Stille Hoch\u00ADzeit');
gameTypes.set('soloWedding', 'Solo Hoch\u00ADzeit');
gameTypes.set('soloWeddingOpponent', 'vs. Solo Hoch\u00ADzeit');
gameTypes.set('dutySolo', 'Pflicht\u00ADsolo');
gameTypes.set('lustSolo', 'Lust\u00ADsolo');
gameTypes.set('forcedSolo', 'Vorführung');
gameTypes.set('soloOpponent', 'Solo Gegner');
gameTypes.set('penalty', 'Strafe erhalten');
gameTypes.set('penaltyOpponent', 'Strafe erteilt');

const soloTypes = new Map<keyof SoloTypes, string>();
soloTypes.set('queens', 'Damen');
soloTypes.set('jacks', 'Buben');
soloTypes.set('kings', 'Königs');
soloTypes.set('fleshless', 'Fleisch\u00ADlos');
soloTypes.set('trump', 'Trumpf');
soloTypes.set('clubs', 'Kreuz');
soloTypes.set('spades', 'Pick');
soloTypes.set('hearts', 'Herz');

const announces = new Map<keyof Announces, string>();
announces.set('announcedRe', `Re`);
announces.set('announcedContra', `Contra`);
announces.set('no9Re', 'Re: Keine 9');
announces.set('no9Contra', 'Contra: Keine 9');
announces.set('no6Re', 'Re: Keine 6');
announces.set('no6Contra', 'Contra: Keine 6');
announces.set('no3Re', 'Re: Keine 3');
announces.set('no3Contra', 'Contra: Keine 3');
announces.set('no0Re', 'Re: Schwarz');
announces.set('no0Contra', 'Contra: Schwarz');

const missedAnnounces = new Map<keyof MissedAnnounces, string>();
missedAnnounces.set('notAnnouncedBut121', 'Nicht angesagt mit 121+');
missedAnnounces.set('notAnnouncedBut151', 'Nicht angesagt mit 151+');
missedAnnounces.set('notAnnouncedBut181', 'Nicht angesagt mit 181+');
missedAnnounces.set('notAnnouncedBut211', 'Nicht angesagt mit 211+');
missedAnnounces.set('notAnnouncedBut240', 'Nicht angesagt mit 240+');
missedAnnounces.set('notNo9But151', 'Nicht `Keine 9` mit 151+');
missedAnnounces.set('notNo9But181', 'Nicht `Keine 9` mit 181+');
missedAnnounces.set('notNo9But211', 'Nicht `Keine 9` mit 211+');
missedAnnounces.set('notNo9But240', 'Nicht `Keine 9` mit 240+');
missedAnnounces.set('notNo6But181', 'Nicht `Keine 6` mit 181+');
missedAnnounces.set('notNo6But211', 'Nicht `Keine 6` mit 211+');
missedAnnounces.set('notNo6But240', 'Nicht `Keine 6` mit 240+');
missedAnnounces.set('notNo3But211', 'Nicht `Keine 3` mit 211+');
missedAnnounces.set('notNo3But240', 'Nicht `Keine 3` mit 240+');
missedAnnounces.set('notNo0But240', 'Nicht `Schwarz` mit 240+');

type Filter = Ui['statistics']['filter'];

const filterValues = {
  gameTypes,
  soloTypes,
  extraPoints,
  announces,
  missedAnnounces,
};

type ValueComponents = {
  [k in Filter]: (props: {key: keyof Stats[k] | 'total'; statistics: Stats}) => ReactElement;
};

const sumUp = (stats: Stats[keyof Stats]) => Object.values(stats).reduce((sum, val) => sum + val, 0);
const perGame = (statistics: Stats, value: number) => `${Math.round(value / statistics.gameTypes.total * 1000)}‰ p.g.`;

const valueComponents: ValueComponents = {
  gameTypes: ({key, statistics}) => {
    return <>
      <Value value={statistics.gameTypes[key]} total={statistics.gameTypes.total}/>
      <Value value={statistics.gameTypesWon[key]} total={statistics.gameTypesWon.total} won/>
    </>;
  },
  soloTypes: ({key, statistics}) => {
    const total = sumUp(statistics.soloTypes);
    const totalWon = sumUp(statistics.soloTypesWon);
    return <>
      <Value value={key === 'total' ? total : statistics.soloTypes[key]} total={total}/>
      <Value value={key === 'total' ? totalWon : statistics.soloTypesWon[key]} total={totalWon} won/>
    </>;
  },
  extraPoints: ({key, statistics}) => {
    if (key === 'total') {
      const s = statistics.extraPoints;
      const won = s.doppelkopf + s.foxCaught + s.karlCaught + s.karlGotLastTrick + s.wonAgainstQueensOfClubs;
      const lost = s.foxLost + s.karlLost;
      return <>
        <ValueGrid values={[
          won,
          perGame(statistics, won),
        ]} won/>
        <ValueGrid values={[
          lost,
          perGame(statistics, lost),
        ]} lost/>
      </>;
    }

    const isLost = key === 'foxLost' || key === 'karlLost';
    const points = statistics.extraPoints[key];
    return <ValueGrid values={[
      points,
      perGame(statistics, points),
    ]} won={!isLost} lost={isLost}/>;
  },
  announces: ({key, statistics}) => {
    const total = sumUp(statistics.announces);
    const value = key === 'total' ? total : statistics.announces[key];
    const totalWon = sumUp(statistics.announcesWon);
    const valueWon = key === 'total' ? totalWon : statistics.announcesWon[key];
    return <>
      <Value value={value} total={total}/>
      <ValueGrid values={[perGame(statistics, value)]}/>
      <Value value={valueWon} total={totalWon} won/>
      <ValueGrid values={[perGame(statistics, valueWon)]} won/>
    </>;
  },
  missedAnnounces: ({key, statistics}) => {
    const total = sumUp(statistics.missedAnnounces);
    const value = key === 'total' ? total : statistics.missedAnnounces[key];
    return <>
      <Value value={value} total={total}/>
      <ValueGrid values={[perGame(statistics, value)]}/>
    </>;
  },
};

interface Option extends StrictDropdownItemProps {
  value: Filter;
}

const filterOptions: Option[] = [
  {text: 'Spieltypen', value: 'gameTypes'},
  {text: 'Soli', value: 'soloTypes'},
  {text: 'Extrapunkte', value: 'extraPoints'},
  {text: 'Ansagen', value: 'announces'},
  {text: 'Verpasste Ansagen', value: 'missedAnnounces'},
];

export default function Statistics(): ReactElement {
  const setUi = useSetUi();
  const {filter, includeIrregularMembers, selectedRow} = useSelector(statisticsSelector);
  const {settings} = useGroup()!;
  const groupMembers = useSortedGroupMembers();
  const initials = useMemberInitials();
  const rows = useMemo(() => {
    let cols = [...filterValues[filter]];
    if (filter === 'soloTypes') {
      cols = cols.filter(([key]) => settings.allowedSoloTypes.includes(key as SoloType));
    }
    cols.unshift(['total', 'Ins\u00ADgesamt']);
    return cols;
  }, [filter, settings.allowedSoloTypes]);

  const setFilter = useCallback((filter: Filter): void => {
    setUi({statistics: {filter, selectedRow: null}});
  }, [setUi]);

  const [columns, rowCells] = useMemo(() => {
    const cols = groupMembers.filter((gm) => includeIrregularMembers || gm.isRegular)
                             .sort((a, b) => {
                               if (a.isYou) {
                                 return -1;
                               }
                               if (b.isYou) {
                                 return 1;
                               }
                               return a.name.localeCompare(b.name);
                             });

    const cells: ReactNode[] = [];
    rows.forEach(([key, text]) => {
      const rowClasses = ['grid-table-td'];
      const isSelected = key === selectedRow;
      if (isSelected) {
        rowClasses.push('selected');
      }

      const onClick = () => {
        setUi({statistics: {selectedRow: key}});
      };

      cells.push(<div key={`label_${key}`} className={classNames(rowClasses, 'label')} onClick={onClick}>{text}</div>);

      cols.forEach(({id, isYou, statistics}) => {
        //@ts-ignore
        const value = valueComponents[filter]({key, statistics});
        cells.push(<div key={`value_${key}_${id}`} className={classNames(rowClasses, {isYou})} onClick={onClick}>
          {value}
        </div>);
      });
    });
    return [cols, cells];
  }, [filter, groupMembers, includeIrregularMembers, rows, setUi, selectedRow]);

  return <Page displayName={'Mitglieder'} menuItems={[EnableIrregularMembersMenuItem]}>
    <section>
      <Dropdown label={'Filter'}
                options={filterOptions}
                value={filter}
                onChange={(e, {value}) => setFilter(value as Filter)}
                selection/>

      <Divider className='tiny' hidden/>

      <div className='grid-table gamesTable statisticsTable u-text-center'
           style={{gridTemplateColumns: `auto repeat(${columns.length}, auto)`}}>
        <div className='grid-table-th'/>
        {columns.map(({id, isYou}) => <div className={classNames('grid-table-th', {isYou})} key={`head_${id}`}>
          {initials[id]}
        </div>)}
        {rowCells}
      </div>
    </section>
  </Page>;
}

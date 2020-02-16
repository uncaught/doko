import React, {ReactElement, ReactNode, useMemo, useState} from 'react';
import {useSortedGroupMembers} from '../../store/GroupMembers';
import {Dropdown, DropdownItemProps} from 'semantic-ui-react';
import {Announces, ExtraPoints, GameTypes, MissedAnnounces, SoloTypes} from '@doko/common/src/Entities/Statistics';
import {useGroup} from '../../store/Groups';
import {SoloType} from '@doko/common';

const extraPoints = new Map<keyof ExtraPoints, string>();
extraPoints.set('doppelkopf', 'Doppel\u00ADkopf');
extraPoints.set('foxCaught', 'Fuchs gefangen');
extraPoints.set('foxLost', 'Fuchs verloren');
extraPoints.set('karlCaught', 'Karl\u00ADchen gefangen');
extraPoints.set('karlGotLastTrick', 'Mit Karl\u00ADchen letzten Stich gemacht');
extraPoints.set('karlLost', 'Karl\u00ADchen im letzten Stich verloren');
extraPoints.set('wonAgainstQueensOfClubs', 'Gegen die Alten gewonnen');

const gameTypes = new Map<keyof GameTypes, string>();
gameTypes.set('total', 'Ins\u00ADgesamt');
gameTypes.set('normal', 'Normal\u00ADspiele');
// gameTypes.set('penalty', 'Strafen');
gameTypes.set('poverty', 'Armut');
gameTypes.set('povertyPartner', 'Armut Partner');
gameTypes.set('povertyOpponent', 'Armut Gegner');
gameTypes.set('wedding', 'Hochzeit');
gameTypes.set('weddingPartner', 'Hoch\u00ADzeit Partner');
gameTypes.set('weddingOpponent', 'Hoch\u00ADzeit Gegner');
gameTypes.set('silentWedding', 'Stille Hoch\u00ADzeit');
gameTypes.set('silentWeddingOpponent', 'Stille Hoch\u00ADzeit Gegner');
gameTypes.set('dutySolo', 'Pflicht\u00ADsolo');
gameTypes.set('lustSolo', 'Lust\u00ADsolo');
gameTypes.set('forcedSolo', 'Vor\u00ADgeführtes Pflicht\u00ADsolo');
gameTypes.set('soloOpponent', 'Solo Gegner');

const soloTypes = new Map<keyof SoloTypes, string>();
soloTypes.set('trump', 'Trumpf-Solo');
soloTypes.set('queens', 'Damen-Solo');
soloTypes.set('jacks', 'Buben-Solo');
soloTypes.set('kings', 'Königs-Solo');
soloTypes.set('clubs', 'Kreuz-Solo');
soloTypes.set('spades', 'Pick-Solo');
soloTypes.set('hearts', 'Herz-Solo');
soloTypes.set('fleshless', 'Fleisch\u00ADlos-Solo');

const announces = new Map<keyof Announces, string>();
announces.set('announced', 'Angesagt');
announces.set('no9', 'Keine 9 abgesagt');
announces.set('no6', 'Keine 6 abgesagt');
announces.set('no3', 'Keine 3 abgesagt');
announces.set('no0', 'Schwarz abgesagt');

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

const filterValues = {
  gameTypes,
  soloTypes,
  announces,
  missedAnnounces,
};

const filterOptions: DropdownItemProps[] = [
  {text: 'Spieltypen', value: 'gameTypes'},
  {text: 'Soli', value: 'soloTypes'},
  {text: 'Ansagen', value: 'announces'},
  {text: 'Verpasste Ansagen', value: 'missedAnnounces'},
];

export default function Statistics(): ReactElement {
  const {settings} = useGroup()!;
  const groupMembers = useSortedGroupMembers();
  const [filter, setFilter] = useState<keyof typeof filterValues>('gameTypes');
  const rows = useMemo(() => {
    const cols = [...filterValues[filter]];
    if (filter === 'soloTypes') {
      return cols.filter(([key]) => settings.allowedSoloTypes.includes(key as SoloType));
    }
    return cols;
  }, [filter, settings.allowedSoloTypes]);

  const columns = groupMembers;

  const rowCells = useMemo(() => {
    const cells: ReactNode[] = [];
    rows.forEach(([key, text]) => {
      const rowClasses = ['grid-table-td'];
      const rowCss = rowClasses.join(' ');

      cells.push(<div key={`label_${key}`} className={'grid-table-td label'}>{text}</div>);
      columns.forEach(({id, statistics}) => {
        const stats = statistics[filter];
        const value = stats[key as keyof typeof stats];
        cells.push(<div key={`value_${key}_${id}`} className={rowCss}>{value}</div>);
      });
    });
    return cells;
  }, [columns, rows, filter]);

  return <section>
    <Dropdown label={'Filter'}
              options={filterOptions}
              value={filter}
              onChange={(e, {value}) => setFilter(value as keyof typeof filterValues)}
              selection/>

    <div className="grid-table gamesTable statisticsTable u-text-center"
         style={{gridTemplateColumns: `auto repeat(${columns.length}, 3em)`}}>
      <div className="grid-table-th"/>
      {columns.map(({id, name}) => <div className="grid-table-th" key={`head_${id}`}>{name[0]}</div>)}
      {rowCells}
    </div>
  </section>;
}

import dayjs from 'dayjs';
import React, {ReactElement, useMemo, useState} from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {useSortedGroupMembers} from '../../store/GroupMembers';
import {useSortedRounds} from '../../store/Rounds';

const colors = [
  '#00ba00', //prevent inlining by prettier
  '#c30000',
  '#0000e6',
  '#c1c100',
  '#00c1c1',
  '#b600b6',
];

interface Entry {
  name: string;
  players: Record<string, {roundBalance: number; totalBalance: number}>;
}

interface Props {
  type: 'roundBalance' | 'totalBalance';
}

export default function GraphStatistic({type}: Props): ReactElement {
  const [focusedLine, setFocusedLine] = useState<number | null>(null);
  const rounds = useSortedRounds();
  const members = useSortedGroupMembers();

  const data = useMemo(() => {
    const totals: Record<string, number> = {};
    const data: Entry[] = [];
    rounds.toReversed().forEach((round) => {
      const results = round.data.results;
      if (results) {
        const entry: Entry = {
          name: dayjs.unix(round.startDate).format('DD.MM.'),
          players: {},
        };
        Object.entries(results.players).forEach(([id, {pointBalance}]) => {
          const total = (totals[id] ?? 0) + pointBalance;
          totals[id] = total;
          entry.players[id] = {
            roundBalance: pointBalance,
            totalBalance: total,
          };
        });
        data.push(entry);
      }
    });
    return data;
  }, [rounds, type]);

  return (
    <div className='graph-statistic'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip contentStyle={{backgroundColor: 'black', fontWeight: 'bold'}} />
          <Legend
            content={({payload}) => {
              return (
                <div className={'graph-statistic-legend'}>
                  {payload!.map((entry, index) => (
                    <div
                      className={'graph-statistic-legend-item'}
                      key={`item-${index}`}
                      onClick={() => setFocusedLine((c) => (c === index ? null : index))}
                      style={{color: colors[index]}}
                    >
                      {entry.value}
                    </div>
                  ))}
                </div>
              );
            }}
          />
          {members.map(({id, name}, idx) => {
            return (
              <Line
                type='monotone'
                key={id}
                dataKey={(obj) => obj.players[id]?.[type] ?? null}
                stroke={colors[idx]}
                strokeWidth={focusedLine === idx ? 4 : 2}
                strokeOpacity={focusedLine === null || focusedLine === idx ? 1 : 0.3}
                name={name}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

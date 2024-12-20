import dayjs from 'dayjs';
import React, {ReactElement} from 'react';
import {Icon, Label, List} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import Page from '../../Page';
import {useGroupMembers} from '../../store/GroupMembers';
import {useSortedRounds} from '../../store/Rounds';

export default function Rounds(): ReactElement {
  const rounds = useSortedRounds();
  const members = useGroupMembers();

  return (
    <Page displayName={'Runden'}>
      <section>
        <List divided relaxed>
          {rounds.map(({id, startDate, endDate, data}) => {
            return (
              <List.Item key={id}>
                <List.Icon name='bullseye' verticalAlign='middle' />
                <List.Content>
                  <List.Header as={asLink(`round/${id}`)}>{dayjs.unix(startDate).format('DD.MM.YYYY')}</List.Header>
                  <List.Description>
                    {endDate === null && (
                      <Label size={'small'} color={'blue'}>
                        Still running <Icon name='hourglass half' />
                      </Label>
                    )}
                    {data.results && (
                      <>
                        <Label size={'small'} color={'yellow'}>
                          {data.results.gamesCount} <Icon name='hashtag' />
                        </Label>
                        <Label size={'small'} color={'green'}>
                          {Object.entries(data.results.players)
                            .filter(([, {pointDiffToTopPlayer}]) => pointDiffToTopPlayer === 0)
                            .map(([id]) => members[id]!.name)
                            .join(', ')}{' '}
                          <Icon name='trophy' />
                        </Label>
                        {data.eurosPerPointDiffToTopPlayer !== null && (
                          <Label size={'small'} color={'blue'}>
                            {(
                              Object.values(data.results.players).reduce(
                                (acc, {pointDiffToTopPlayer}) => acc + pointDiffToTopPlayer,
                                0,
                              ) * data.eurosPerPointDiffToTopPlayer
                            ).toFixed(2)}{' '}
                            <Icon name='euro sign' />
                          </Label>
                        )}
                      </>
                    )}
                  </List.Description>
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      </section>
    </Page>
  );
}

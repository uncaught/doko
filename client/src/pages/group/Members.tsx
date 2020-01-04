import React, {ReactElement} from 'react';
import {Header, Icon, Label, List} from 'semantic-ui-react';
import {useSortedGroupMembers} from '../../store/GroupMembers';
import {useGroup} from '../../store/Groups';
import {asLink} from '../../AsLink';
import {useFullParams} from '../../Page';

export default function Members(): ReactElement {
  const {groupId} = useFullParams<{ groupId: string }>();
  const {roundsCount: groupRoundsCount = 0} = useGroup() || {};
  const groupMembers = useSortedGroupMembers();

  return <section>
    <Header as='h4'>Mitglieder</Header>

    {groupMembers.length > 0 && <div className="">
      <List divided relaxed>
        {groupMembers.map(({id, name, pointBalance = 0, roundsCount = 0, euroBalance = 0, isYou}) =>
          <List.Item as={asLink(`/groups/group/${groupId}/member/${id}`)} key={id}>
            <List.Icon color={'black'} size={'large'} name='user' verticalAlign='middle'/>
            <List.Content>
              <List.Header>{name}</List.Header>
              <List.Description>
                <Label size={'small'} color={pointBalance >= 0 ? 'green' : 'red'}>
                  {pointBalance} <Icon name='sort'/>
                </Label>
                <Label size={'small'} color={'orange'}>
                  {roundsCount} / {groupRoundsCount
                  ? Math.ceil(roundsCount / groupRoundsCount * 100)
                  : 0}% <Icon name='time'/>
                </Label>
                {!!euroBalance && <Label size={'small'} color={'blue'}>
                  {euroBalance} <Icon name='euro sign'/>
                </Label>}
                {!!isYou && <Label size={'small'} color={'teal'}>
                  du <Icon name='linkify'/>
                </Label>}
              </List.Description>
            </List.Content>
          </List.Item>)}
      </List>
    </div>}
  </section>;
}

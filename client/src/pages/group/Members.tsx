import React, {ReactElement} from 'react';
import {Header, Icon, Label, List} from 'semantic-ui-react';
import {useSortedGroupMembers} from '../../Store/GroupMembers';
import {useGroup} from '../../Store/Groups';
import {asLink} from '../../AsLink';
import {useFullParams} from '../../FullRoute';

export default function Members(): ReactElement {
  const {groupId} = useFullParams<{ groupId: string }>();
  const {roundsCount: groupRoundsCount = 1} = useGroup() || {};
  const groupMembers = useSortedGroupMembers();

  return <section>
    <Header as='h4'>Mitglieder</Header>

    {groupMembers.length > 0 && <div className="">
      <List divided relaxed>
        {groupMembers.map(({id, name, pointBalance = 0, roundsCount = 0, euroBalance = 0}) =>
          <List.Item key={id}>
            <List.Icon name='user' verticalAlign='middle'/>
            <List.Content>
              <List.Header as={asLink(`/group/${groupId}/member/${id}`, {className: 'header'})}>{name}</List.Header>
              <List.Description>
                <Label size={'small'} color={pointBalance >= 0 ? 'green' : 'red'}>
                  {pointBalance} <Icon name='sort'/>
                </Label>
                <Label size={'small'} color={'orange'}>
                  {roundsCount} / {Math.ceil(roundsCount / groupRoundsCount * 100)}% <Icon name='time'/>
                </Label>
                {!!euroBalance && <Label size={'small'} color={'blue'}>
                  {euroBalance} <Icon name='euro sign'/>
                </Label>}
              </List.Description>
            </List.Content>
          </List.Item>)}
      </List>
    </div>}
  </section>;
}

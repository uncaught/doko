import React, {ReactElement} from 'react';
import {Header, Icon, Label, List} from 'semantic-ui-react';
import {useSortedGroupMembers} from '../../Store/GroupMembers';
import {useSelector} from 'react-redux';
import {groupsSelector} from '../../Store/Groups';
import {asLink} from '../../AsLink';
import {useFullParams} from '../../FullRoute';

export default function Members(): ReactElement {
  const {groupId} = useFullParams<{ groupId: string }>();
  const {name: groupName, roundsCount: groupRoundsCount = 1} = useSelector(groupsSelector)[groupId];
  const groupMembers = useSortedGroupMembers();

  return <div>
    <Header>Mitglieder von {groupName}</Header>

    {groupMembers.length > 0 && <div className={'group-members'}>
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
  </div>;
}

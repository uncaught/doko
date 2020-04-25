import React, {ReactElement} from 'react';
import {Icon, Label, List} from 'semantic-ui-react';
import {useSortedGroupMembers} from '../../store/GroupMembers';
import {useGroup} from '../../store/Groups';
import {asLink} from '../../AsLink';
import {usePageContext} from '../../Page';

export default function Members(): ReactElement {
  const {groupId} = usePageContext<{ groupId: string }>();
  const {completedRoundsCount} = useGroup() || {};
  const groupMembers = useSortedGroupMembers();

  return <section>
    {groupMembers.length > 0 && <div className="">
      <List divided relaxed>
        {groupMembers.map(({id, name, pointBalance = 0, pointDiffToTopPlayer = 0, roundsCount = 0, euroBalance, isYou}) =>
          <List.Item as={asLink(`/group/${groupId}/member/${id}`)} key={id}>
            <List.Icon color={'black'} size={'large'} name='user' verticalAlign='middle'/>
            <List.Content>
              <List.Header>{name}</List.Header>
              <List.Description>
                <Label size={'small'} color={pointBalance >= 0 ? 'green' : 'red'}>
                  {pointBalance} <Icon name='sort'/>
                </Label>
                {typeof euroBalance !== 'number' && <Label size={'small'} color={'yellow'}>
                  {pointDiffToTopPlayer} <Icon name='bullseye'/>
                </Label>}
                {typeof euroBalance === 'number' && <Label size={'small'} color={'blue'}>
                  {euroBalance.toFixed(2)} <Icon name='euro sign'/>
                </Label>}
                <Label size={'small'} color={'orange'}>
                  {roundsCount} / {completedRoundsCount
                  ? Math.ceil(roundsCount / completedRoundsCount * 100)
                  : 0}% <Icon name='time'/>
                </Label>
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

import React, {ReactElement} from 'react';
import {Link} from 'react-router-dom';
import {Header, Icon} from 'semantic-ui-react';
import {useGroup} from '../../store/Groups';

export default function GroupName(): ReactElement {
  const group = useGroup();
  return <div className='u-flex-row-between groupNameHeader'>
    <Header as={'h2'}><Icon name={'group'} size={'small'}/> {group && group.name}</Header>
    <Link to={`/settings`}>
      <Icon name={'cogs'}/>
    </Link>
  </div>;
}

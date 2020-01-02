import React, {ReactElement} from 'react';
import {Header, Icon} from 'semantic-ui-react';
import {Link, useRouteMatch} from 'react-router-dom';
import {useGroup} from '../../Store/Groups';

export default function GroupName(): ReactElement {
  const group = useGroup();
  const {url} = useRouteMatch();
  return <div className="u-flex-row-between editableNameHeader">
    <Header as={'h2'}><Icon name={'group'} size={'small'}/> {group && group.name}</Header>
    <Link to={`${url}/settings`}>
      <Icon name={'cogs'}/>
    </Link>
  </div>;
}

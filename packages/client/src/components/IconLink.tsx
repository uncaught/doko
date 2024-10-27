import React, {ReactElement} from 'react';
import {Link} from 'react-router-dom';
import {Icon} from 'semantic-ui-react';

export default function IconLink({children, to}: {children: React.ReactNode; to: string}): ReactElement {
  return (
    <p>
      <Link to={to}>
        <Icon name={'location arrow'} color={'blue'} /> {children}
      </Link>
    </p>
  );
}

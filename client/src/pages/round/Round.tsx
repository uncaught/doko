import React, {ReactElement} from 'react';
import {useRouteMatch} from 'react-router-dom';
import IconLink from '../../components/IconLink';
import Players from './Players';
import {Divider} from 'semantic-ui-react';

export default function Round(): ReactElement {
  const {url} = useRouteMatch();
  return <section>
    <IconLink to={`${url}/players`}>Sitzfolge / Teilnahme</IconLink>
    <IconLink to={`${url}/games`}>Spiele</IconLink>
    <Divider section/>
    <Players/>
  </section>;
}

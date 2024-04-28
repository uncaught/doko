import React, {ReactElement} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {Divider} from 'semantic-ui-react';
import IconLink from '../../components/IconLink';
import FinishRound from './FinishRound';
import GamesInfo from './GamesInfo';
import Players from './Players';

export default function Round(): ReactElement {
  const {url} = useRouteMatch();
  return <section>
    <IconLink to={`${url}/players`}>Sitzfolge / Teilnahme</IconLink>
    <Divider/>
    <GamesInfo/>
    <Divider/>
    <Players/>
    <Divider/>
    <FinishRound/>
  </section>;
}

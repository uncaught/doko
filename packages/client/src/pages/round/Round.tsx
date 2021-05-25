import React, {ReactElement} from 'react';
import {useRouteMatch} from 'react-router-dom';
import IconLink from '../../components/IconLink';
import Players from './Players';
import {Divider} from 'semantic-ui-react';
import GamesInfo from './GamesInfo';
import FinishRound from './FinishRound';

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

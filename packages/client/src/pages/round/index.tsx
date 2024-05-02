import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import IconLink from '../../components/IconLink';
import Page from '../../Page';
import {useLoadRoundDetails, useRound} from '../../store/Rounds';
import FinishRound from './FinishRound';
import GamesInfo from './GamesInfo';
import Players from './Players';
import RemoveRoundMenuItem from './RemoveRoundMenuItem';

export default function Round(): ReactElement | null {
  useLoadRoundDetails();
  if (!useRound()) {
    return null;
  }
  return <Page displayName={'Runde'} menuItems={[RemoveRoundMenuItem]}>
    <section>
      <IconLink to={`players`}>Sitzfolge / Teilnahme</IconLink>
      <Divider/>
      <GamesInfo/>
      <Divider/>
      <Players/>
      <Divider/>
      <FinishRound/>
    </section>
  </Page>;
}

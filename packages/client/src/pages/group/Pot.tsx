import React, {ReactElement} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {Divider} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useGroup} from '../../store/Groups';
import FullPot from '../pot/FullPot';

export default function Pot(): ReactElement | null {
  const group = useGroup();
  const {url} = useRouteMatch();
  if (!group?.settings.eurosPerPointDiffToTopPlayer) {
    return null;
  }
  return <>
    <FullPot as={asLink(`${url}/pot`)}/>
    <Divider/>
  </>;
}

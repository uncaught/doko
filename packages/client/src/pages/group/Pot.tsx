import React, {ReactElement} from 'react';
import {asLink} from '../../AsLink';
import {useRouteMatch} from 'react-router-dom';
import FullPot from '../pot/FullPot';
import {Divider} from 'semantic-ui-react';
import {useGroup} from '../../store/Groups';

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

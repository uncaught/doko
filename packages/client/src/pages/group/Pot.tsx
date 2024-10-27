import React, {ReactElement} from 'react';
import {Divider} from 'semantic-ui-react';
import {asLink} from '../../AsLink';
import {useGroup} from '../../store/Groups';
import FullPot from '../pot/FullPot';

export default function Pot(): ReactElement | null {
  const group = useGroup();
  if (!group?.settings.eurosPerPointDiffToTopPlayer) {
    return null;
  }
  return (
    <>
      <FullPot as={asLink(`pot`)} />
      <Divider />
    </>
  );
}

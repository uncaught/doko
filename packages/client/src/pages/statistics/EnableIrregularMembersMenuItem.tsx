import React, {ReactElement} from 'react';
import {useSelector} from 'react-redux';
import {Icon, Menu} from 'semantic-ui-react';
import {statisticsSelector, useSetUi} from '../../store/Ui';

export default function EnableIrregularMembersMenuItem({closeMenu}: {closeMenu: () => void}): ReactElement | null {
  const setUi = useSetUi();
  const {includeIrregularMembers} = useSelector(statisticsSelector);
  return (
    <Menu.Item
      onClick={() => {
        closeMenu();
        setUi({statistics: {includeIrregularMembers: !includeIrregularMembers}});
      }}
    >
      <Icon name='user' />
      {includeIrregularMembers ? 'Nur reguläre Mitglieder anzeigen' : 'Auch nicht reguläre Mitglieder anzeigen'}
    </Menu.Item>
  );
}

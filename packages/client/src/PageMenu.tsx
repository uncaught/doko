import React, {ReactElement, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Checkbox, Icon, Menu} from 'semantic-ui-react';
import {SemanticICONS} from 'semantic-ui-react/dist/commonjs/generic';
import {asLink} from './AsLink';
import {usePageContext} from './Page';
import {useLatestGroupGame} from './store/Games';
import {useLatestGroupRound} from './store/Rounds';
import {followLastGameSelector, useSetUi} from './store/Ui';

export interface PageMenuItemConfig {
  route: string;
  icon: SemanticICONS;
  title: string;
  passDown?: boolean;
}

export type PageMenuItemComp = React.FC<{closeMenu: () => void}> & {passDown?: boolean};

export type PageMenuItems = Array<PageMenuItemConfig | PageMenuItemComp>;

function isConfig(item: PageMenuItemConfig | PageMenuItemComp): item is PageMenuItemConfig {
  return item.hasOwnProperty('route');
}

function FollowLastGameMenuItem(): ReactElement {
  const checked = useSelector(followLastGameSelector);
  const setUi = useSetUi();
  return (
    <Menu.Item>
      <Icon name='forward' />
      <Checkbox
        label={'Spielen folgen'}
        checked={checked}
        onChange={(_e, {checked}) => setUi({followLastGame: checked})}
      />
    </Menu.Item>
  );
}

export default function PageMenu({closeMenu}: {closeMenu: () => void}): ReactElement | null {
  const {groupId} = useParams<{groupId?: string}>();
  const {menuItems} = usePageContext();
  const lastRound = useLatestGroupRound();
  const lastGame = useLatestGroupGame();
  const Item = useCallback(
    ({children, route}: {children: React.ReactNode; route: string}) => {
      return <Menu.Item as={asLink(route, {onClick: closeMenu})}>{children}</Menu.Item>;
    },
    [closeMenu],
  );
  return (
    <>
      <Item route={'/'}>
        <Icon name='group' />
        Meine Gruppen
      </Item>
      <Item route={'/simulation'}>
        <Icon name='gamepad' />
        Simulation
      </Item>

      {!!groupId && (
        <>
          <Item route={`/group/${groupId}/statistics`}>
            <Icon name='balance scale' />
            Statistiken
          </Item>

          {!!lastRound && (
            <>
              <Item route={`/group/${groupId}/rounds/round/${lastRound.id}`}>
                <Icon name='bullseye' />
                Letzte Runde
              </Item>
            </>
          )}

          {!!lastGame && (
            <>
              <Item route={`/group/${groupId}/rounds/round/${lastGame.roundId}/games/game/${lastGame.id}`}>
                <Icon name='hashtag' />
                Letztes Spiel
              </Item>
            </>
          )}
        </>
      )}

      <FollowLastGameMenuItem />

      {menuItems.map((MenuItem, idx) => {
        if (isConfig(MenuItem)) {
          return (
            <Item key={idx} route={MenuItem.route}>
              <Icon name={MenuItem.icon} />
              {MenuItem.title}
            </Item>
          );
        }
        return <MenuItem key={idx} closeMenu={closeMenu} />;
      })}
    </>
  );
}

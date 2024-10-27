import React, {PropsWithChildren, ReactElement, useCallback, useContext, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {Menu, Sidebar} from 'semantic-ui-react';
import PageHeader from './PageHeader';
import PageMenu, {PageMenuItems} from './PageMenu';

const context = React.createContext<PageContext>({menuItems: []});

interface PageContext {
  menuItems: PageMenuItems;
}

export function usePageContext(): PageContext;
export function usePageContext<T extends object>(): T & PageContext;
export function usePageContext<T extends object>(): T & PageContext {
  return useContext(context) as T & PageContext;
}

interface PageContextProps {
  parentPageContext: PageContext;
  menuItems?: PageMenuItems;
}

function PageContextProvider({
  children,
  parentPageContext,
  menuItems,
}: PropsWithChildren<PageContextProps>): ReactElement {
  const fullParams: PageContext = {
    ...parentPageContext,
    menuItems: [...parentPageContext.menuItems.filter((item) => item.passDown), ...(menuItems || [])],
  };
  return <context.Provider value={fullParams}>{children}</context.Provider>;
}

interface Props {
  displayName: string;
  menuItems?: PageMenuItems;
  ExtraSidebar?: React.FunctionComponent<{visible: boolean; close: () => void}>;
}

export default function Page({children, displayName, menuItems, ExtraSidebar}: PropsWithChildren<Props>): ReactElement {
  const [visible, setVisible] = useState(false);
  const [extraSidebarVisible, setExtraSidebarVisible] = useState(false);
  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);
  const parentPageContext = usePageContext();

  return (
    <PageContextProvider parentPageContext={parentPageContext} menuItems={menuItems}>
      <Sidebar.Pushable as={'div'} className='appPageWrapper'>
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          inverted
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width='thin'
          direction='right'
        >
          <PageMenu closeMenu={closeMenu} />
        </Sidebar>
        {ExtraSidebar && <ExtraSidebar visible={extraSidebarVisible} close={() => setExtraSidebarVisible(false)} />}
        <Sidebar.Pusher dimmed={visible || extraSidebarVisible}>
          <div className='appPage'>
            <PageHeader
              displayName={displayName}
              openMenu={openMenu}
              onNameClick={() => {
                if (ExtraSidebar) {
                  setExtraSidebarVisible(true);
                }
              }}
            />
            <div className='appPageContent'>{children}</div>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
      <Outlet />
    </PageContextProvider>
  );
}

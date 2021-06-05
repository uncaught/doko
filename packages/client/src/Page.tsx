import {RouteProps} from 'react-router';
import React, {ReactElement, useCallback, useContext, useState} from 'react';
import {Route, useParams, useRouteMatch} from 'react-router-dom';
import {Menu, Sidebar} from 'semantic-ui-react';
import PageMenu, {PageMenuItems} from './PageMenu';
import PageHeader from './PageHeader';

const context = React.createContext<PageContext>({displayName: 'Doppelkopf', menuItems: [], parents: []});

interface PageContext {
  displayName: string;
  menuItems: PageMenuItems;
  parents: Array<{ displayName: string; url: string }>;
}

export function usePageContext(): PageContext;
export function usePageContext<T extends object>(): T & PageContext;
export function usePageContext<T extends object>(): T & PageContext {
  return useContext(context) as T & PageContext;
}

interface PageContextProps {
  children: React.ReactNode;
  parentPageContext: PageContext;
  parentUrl: string;
  displayName?: string;
  isIndex: boolean;
  menuItems?: PageMenuItems;
}

function PageContextProvider(
  {children, parentPageContext, displayName, parentUrl, isIndex, menuItems}: PageContextProps,
): ReactElement {
  const localParams = useParams();
  const fullParams: PageContext = {
    ...parentPageContext,
    ...localParams,
    displayName: displayName || parentPageContext.displayName,
    menuItems: [...parentPageContext.menuItems.filter((item) => item.passDown), ...(menuItems || [])],
  };
  if (!isIndex) {
    fullParams.parents = [
      {displayName: parentPageContext.displayName, url: parentUrl},
      ...parentPageContext.parents,
    ];
  }
  Object.keys(localParams).forEach((key) => {
    if (parentPageContext.hasOwnProperty(key)) {
      console.warn(`Overwriting parent parameter '${key}' with child value`);
    }
  });
  return <context.Provider value={fullParams}>{children}</context.Provider>;
}

interface FullRouteProps extends RouteProps {
  displayName?: string;
  menuItems?: PageMenuItems;
  ExtraSidebar?: React.FunctionComponent<{ visible: boolean; close: () => void }>;
}

export default function Page(props: FullRouteProps): ReactElement {
  const [visible, setVisible] = useState(false);
  const [extraSidebarVisible, setExtraSidebarVisible] = useState(false);
  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);
  const parentPageContext = usePageContext();
  const parentUrl = useRouteMatch().url;
  const isIndex = parentUrl === props.path;
  const routeProps = {...props};
  delete routeProps.children;
  delete routeProps.displayName;
  delete routeProps.menuItems;
  delete routeProps.ExtraSidebar;
  return <Route {...routeProps}>
    <PageContextProvider parentPageContext={parentPageContext}
                         parentUrl={parentUrl}
                         displayName={props.displayName}
                         menuItems={props.menuItems}
                         isIndex={isIndex}>
      <Sidebar.Pushable as={'div'} className="appPageWrapper">
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
          <PageMenu closeMenu={closeMenu}/>
        </Sidebar>
        {props.ExtraSidebar && <props.ExtraSidebar visible={extraSidebarVisible}
                                                   close={() => setExtraSidebarVisible(false)}/>}
        <Sidebar.Pusher dimmed={visible || extraSidebarVisible}>
          <div className="appPage">
            <PageHeader openMenu={openMenu} onNameClick={() => {
              if (props.ExtraSidebar) {
                setExtraSidebarVisible(true);
              }
            }}/>
            <div className="appPageContent">
              {props.children}
            </div>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </PageContextProvider>
  </Route>;
}

import {RouteProps} from 'react-router';
import React, {ReactElement, useCallback, useContext, useState} from 'react';
import {Route, useParams, useRouteMatch} from 'react-router-dom';
import {Menu, Sidebar} from 'semantic-ui-react';
import PageMenu, {PageMenuItems} from './PageMenu';
import PageHeader from './PageHeader';

const context = React.createContext<FullParams>({displayName: 'Doppelkopf', parents: []});

interface FullParams {
  displayName: string;
  parents: Array<{ displayName: string; url: string }>;
}

export function useFullParams<T extends object>(): T & FullParams {
  return useContext(context) as T & FullParams;
}

interface PageContextProps {
  children: React.ReactNode;
  parentParams: FullParams;
  parentUrl: string;
  displayName?: string;
  isIndex: boolean;
}

function PageContext({children, parentParams, displayName, parentUrl, isIndex}: PageContextProps): ReactElement {
  const localParams = useParams();
  const fullParams = {...parentParams, ...localParams, displayName: displayName || parentParams.displayName};
  if (!isIndex) {
    fullParams.parents = [
      {displayName: parentParams.displayName, url: parentUrl},
      ...parentParams.parents,
    ];
  }
  Object.keys(localParams).forEach((key) => {
    if (parentParams.hasOwnProperty(key)) {
      console.warn(`Overwriting parent parameter '${key}' with child value`);
    }
  });
  return <context.Provider value={fullParams}>{children}</context.Provider>;
}

interface FullRouteProps extends RouteProps {
  displayName?: string;
  menuItems?: PageMenuItems;
}

export default function Page(props: FullRouteProps): ReactElement {
  const [visible, setVisible] = useState(false);
  const openMenu = useCallback(() => setVisible(true), []);
  const closeMenu = useCallback(() => setVisible(false), []);
  const parentParams = useFullParams();
  const parentUrl = useRouteMatch().url;
  const isIndex = parentUrl === props.path;
  const routeProps = {...props};
  delete routeProps.children;
  delete routeProps.displayName;
  delete routeProps.menuItems;
  return <Route {...routeProps}>
    <PageContext parentParams={parentParams} parentUrl={parentUrl} displayName={props.displayName} isIndex={isIndex}>
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
          <PageMenu closeMenu={closeMenu} menuItems={props.menuItems}/>
        </Sidebar>
        <Sidebar.Pusher dimmed={visible}>
          <div className="appPage">
            <PageHeader openMenu={openMenu}/>
            <div className="appPageContent">
              {props.children}
            </div>
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </PageContext>
  </Route>;
}

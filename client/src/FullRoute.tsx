import {RouteProps} from 'react-router';
import React, {ReactElement, useContext} from 'react';
import {Route, useParams} from 'react-router-dom';

const context = React.createContext({});

export function useFullParams<T extends object>(): T {
  return useContext(context) as T;
}

function FullRouteContext({children, parentParams}: { children: React.ReactNode; parentParams: object }): ReactElement {
  const localParams = useParams();
  const fullParams = {...parentParams, ...localParams};
  Object.keys(localParams).forEach((key) => {
    if (parentParams.hasOwnProperty(key)) {
      console.warn(`Overwriting parent parameter '${key}' with child value`);
    }
  });
  return <context.Provider value={fullParams}>{children}</context.Provider>;
}

export default function FullRoute<T extends RouteProps = RouteProps>(props: T): ReactElement {
  const parentParams = useFullParams();
  const routeProps = {...props};
  delete routeProps.children;
  return <Route {...routeProps}>
    <FullRouteContext parentParams={parentParams}>
      {props.children}
    </FullRouteContext>
  </Route>;
}

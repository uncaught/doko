import React from 'react';
import {Link} from 'react-router-dom';

/**
 * Can be used for an "as" property to render things
 */
export function asLink(
  route: string,
  {className, onClick}: { className?: string; onClick?: () => void } = {},
): React.FC {
  return ({children}) => <Link className={className} onClick={onClick} to={route}>{children}</Link>;
}

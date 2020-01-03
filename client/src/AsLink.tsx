import React from 'react';
import {Link} from 'react-router-dom';

/**
 * Can be used for an "as" property to render things
 */
export function asLink(
  route: string,
  {onClick}: { onClick?: () => void } = {},
): React.FC<{ className?: string }> {
  return ({children, className}) => <Link className={className} onClick={onClick} to={route}>{children}</Link>;
}

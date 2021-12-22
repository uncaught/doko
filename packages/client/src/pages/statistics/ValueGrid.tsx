import classNames from "classnames";
import {Fragment, ReactElement, ReactNode} from "react";

export default function ValueGrid({values, won, lost}: {values: ReactNode[]; won?: boolean; lost?: boolean}): ReactElement {
  return <div className={classNames('statsValue', {won, lost})}>
    {values.map((value, index) => <Fragment key={index}>
      {index > 0 && <div className="statsValueSeparator">/</div>}
      <div>{value}</div>
    </Fragment>)}
  </div>;
}
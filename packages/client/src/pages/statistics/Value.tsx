import {ReactElement, ReactNode} from "react";
import ValueGrid from "./ValueGrid";

export default function Value({value, total, won}: {value: number; total?: number; won?: boolean}): ReactElement {
  const values: ReactNode[] = [value];
  if (typeof total === 'number') {
    values.push(`${Math.round(value / total * 100)}%`);
  }
  return <ValueGrid values={values} won={won}/>;
}
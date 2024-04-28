import {AnyObject} from './Generics';

/**
 * To debug changes in hooks, create an instance of this method in your component, then call it with any values you
 * wish to compare:
 *
 *
 * const debug = debugHooks();
 *
 * export default function MyComponent(): ReactElement {
 *   const xxx = useHook1();
 *   const yyy = useHook2();
 *
 *   debug({xxx, yyy});
 *
 *   //...
 * }
 */
export function debugHooks(name = 'debugHooks'): (obj: AnyObject) => void {
  let lastObj: AnyObject;
  return ((obj) => {
    if (lastObj) {
      const changedValues: Array<{key: string; old: any; new: any}> = [];
      Object.entries(lastObj).forEach(([key, val]) => {
        if (val !== obj[key]) {
          changedValues.push({key, old: val, new: obj[key]});
        }
      });
      if (changedValues.length) {
        console.warn(`${name} changed values`, changedValues);
      }
    }
    lastObj = obj;
  });
}

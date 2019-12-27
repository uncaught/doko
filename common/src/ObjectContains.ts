import isPlainObject from 'lodash/isPlainObject';
import {AnyObject, DeepPartial} from './Generics';

/**
 * Returns TRUE if haystack contains the same data as needle does
 *
 * Basically this is a partial compare.
 */
export function objectContains<TNeedle extends AnyObject, THaystack extends TNeedle = TNeedle>(
  haystack: THaystack,
  needle: DeepPartial<THaystack>,
): boolean {
  if (!isPlainObject(haystack)) {
    throw new Error(`Invalid haystack`);
  }
  if (!isPlainObject(needle)) {
    throw new Error(`Invalid needle`);
  }
  return Object.keys(needle).every((key: keyof TNeedle) => {
    if (isPlainObject(haystack[key]) && isPlainObject(needle[key])) {
      return objectContains(haystack[key], needle[key] as DeepPartial<TNeedle[keyof TNeedle]>);
    }
    return needle[key] === haystack[key];
  });
}

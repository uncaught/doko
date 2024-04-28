import {cloneDeep, isPlainObject} from 'lodash';
import {AnyArray, AnyObject, DeepPartial} from './Generics';

interface MergeStatesOptions {
  replaceArrays: boolean;
  explicitUndefines?: boolean;
}

function mergeArrays(targetState: AnyArray, partialState: AnyArray, options: MergeStatesOptions): AnyArray {
  if (options.replaceArrays) {
    return cloneDeep(partialState);
  }
  let changed = false;
  const newState = [...targetState];
  partialState.forEach((val, index) => {
    if (typeof val !== 'undefined') {
      const newValue = merge(targetState[index], val, options);
      if (newValue !== newState[index]) {
        newState[index] = newValue;
        changed = true;
      }
    }
  });
  return changed ? newState : targetState;
}

function mergeObjects(targetState: AnyObject, partialState: AnyObject, options: MergeStatesOptions): AnyObject {
  let changed = false;
  const newState = {...targetState};
  Object.entries(partialState).forEach(([key, val]) => {
    const newValue = merge(targetState[key], val, options);
    if (newValue !== newState[key]
      || (newValue === undefined && options.explicitUndefines && !newState.hasOwnProperty(key))
    ) {
      newState[key] = newValue;
      changed = true;
    }
  });
  return changed ? newState : targetState;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function merge(targetState: any, partialState: any, options: MergeStatesOptions): any {
  if (Array.isArray(partialState)) {
    if (targetState && !Array.isArray(targetState)) {
      throw new Error('Merging array into non-array!');
    }
    return targetState ? mergeArrays(targetState, partialState, options) : partialState;
  } else if (isPlainObject(partialState)) {
    if (targetState && !isPlainObject(targetState)) {
      throw new Error('Merging object into non-object!');
    }
    return targetState ? mergeObjects(targetState, partialState, options) : partialState;
  } else {
    return partialState;
  }
}

/**
 * Deep merge of states, creating new objects when merging, keeping untouched deep children.
 */
export function mergeStates<S>(
  targetState: S,
  partialState: DeepPartial<S>,
  {replaceArrays = true, explicitUndefines = false}: {replaceArrays?: boolean; explicitUndefines?: boolean} = {},
): S {
  return merge(targetState, partialState, {replaceArrays, explicitUndefines});
}

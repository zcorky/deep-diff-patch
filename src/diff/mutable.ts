import {
  primitive as isPrimitive,
  array as isArray,
  undefined as isUndefined,
} from '@zcorky/is';
import { diffPrimitive } from './primitive';
import {
  JSON,
} from '../types';

/**
 * deep diff
 * @param obj Primitive | Array | Object | Function
 *
 * principle:
 *  1. deep clone
 *  2. type:
 *    2.1 create
 *    2.2 update
 *    2.3 delete
 *    2.4 unchanged
 *  3. tag 叶子节点 { type, prev, next }
 *    3.1 primitive
 *    3.2 object { type, path, key, value }
 *    3.3 array { type, path, key, value }
 */

export function diff(prev: JSON, next: JSON) {
  if (isPrimitive(prev) || isPrimitive(next)) {
    return diffPrimitive(prev, next);
  }

  // object / array
  const diffs = isArray(prev) ? [] : {};

  // key in prev
  for (const key in prev) {
    const prevValue = prev[key];
    const nextValue = next[key];

    diffs[key] = diff(prevValue, nextValue);
  }

  // key in next
  for (const key in next) {
    if (isUndefined(prev[key])) {
      diffs[key] = diffPrimitive(undefined, next[key]);
    }
  }

  return diffs;
}
import {
  Primitive,
  primitive as isPrimitive,
  array as isArray,
  undefined as isUndefined,
} from '@zcorky/is';

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

export type JSON = Primitive | object | any[];

export interface Diff {
  type: Type;
  prev: JSON;
  next: JSON;
};

export enum Type {
  CREATE = 0, // 'CREATE'
  UPDATE = 1, // 'UPDATE'
  DELETE = 2, // 'DELETE'
  UNCHANGE = 3, // 'UNCHANGE'
}

function diffPrimitive(prev: any, next: any): Diff {
  if (prev === undefined) {
    if (next === undefined) {
      return {
        type: Type.UNCHANGE,
        prev,
        next,
      };
    } else {
      return {
        type: Type.CREATE,
        prev,
        next,
      }
    }
  } else {
    if (next === undefined) {
      return {
        type: Type.DELETE,
        prev,
        next,
      };
    } else {
      if (prev === next) {
        return {
          type: Type.UNCHANGE,
          prev,
          next,
        };
      }

      return {
        type: Type.UPDATE,
        prev,
        next,
      };
    }
  }
}

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


export function patch(origin: JSON, diffs: object) {
  // @树叶节点
  if (isPrimitive(origin) || 'type' in diffs && 'prev' in diffs && 'next' in diffs) {
    const diff = diffs as Diff;
    switch(diff.type) {
      case Type.CREATE:
        return diff.next;
      case Type.UPDATE:
        // immutable
        return diff.next;
      case Type.DELETE:
        return undefined;
      default:
        return origin;
    }
  }

  // immutable
  const immutableOrigin = isArray(origin) ? [] : {};
  for (const key in diffs) {
    const immutable = patch(origin[key], diffs[key]);

    // @DELETE
    if (immutable === undefined && origin[key] !== undefined) {
      delete immutableOrigin[key];
    } else {
      immutableOrigin[key] = immutable
    }
  }

  return immutableOrigin;
}
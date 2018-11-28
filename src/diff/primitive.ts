import {
  undefined as isUndefined,
} from '@zcorky/is';
import {
  Diff,
  Type,
} from '../types';

export function diffPrimitive(prev: any, next: any): Diff {
  // 1.unchange
  if (prev === next) {
    return {
      type: Type.UNCHANGE,
      prev,
      next,
    };
  }

  // 2.create / update /delete
  // 2.1 if prev is undefined, create
  if (isUndefined(prev)) {
    return {
      type: Type.CREATE,
      prev,
      next,
    }
  } else {
    // 2.2 prev is not undefine
    // 2.2.1 next is undefined, delete
    if (isUndefined(next)) {
      return {
        type: Type.DELETE,
        prev,
        next,
      };
    } else {
      // 2.2.1 next is not undefined, update
      return {
        type: Type.UPDATE,
        prev,
        next,
      };
    }
  }
}

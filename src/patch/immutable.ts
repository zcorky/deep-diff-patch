import {
  primitive as isPrimitive,
  array as isArray,
  undefined as isUndefined,
} from '@zcorky/is';

import {
  JSON,
  Diff,
  Type,
} from '../types';

export function patch(origin: JSON, diffs: object) {
  // 0. false
  if (diffs as any as boolean === false) {
    return origin;
  }

  // 1. diff tree leaf with valid diffs
  if ('type' in diffs && 'prev' in diffs && 'next' in diffs) {
    const _diff = diffs as Diff;
    switch (_diff.type) {
      case Type.CREATE:
      case Type.UPDATE:
        // immutable
        return _diff.next;
      case Type.DELETE:
        return undefined;
      default:
        return origin;
    }
  }

  // 2. without current layer diffs
  // 2.1 primitive return
  if (isPrimitive(origin)) {
    return origin;
  }

  // 2.2. array or object
  const immutableOrigin = isArray(origin) ? [] : {};
  for (const key in diffs) {
    const immutable = patch(origin[key], diffs[key]);

    // @DELETE
    if (isUndefined(immutable) && !isUndefined(origin[key])) {
      delete immutableOrigin[key];
    } else {
      // @UNCHANGE/CREATE/UPDATE
      immutableOrigin[key] = immutable
    }
  }

  return immutableOrigin;
}

# deep-diff-patch

[![NPM version](https://img.shields.io/npm/v/@zcorky/deep-diff-patch.svg?style=flat)](https://www.npmjs.com/package/@zcorky/deep-diff-patch)
[![Coverage Status](https://img.shields.io/coveralls/zcorky/deep-diff-patch.svg?style=flat)](https://coveralls.io/r/zcorky/deep-diff-patch)
[![Dependencies](https://david-dm.org/@zcorky/deep-diff-patch/status.svg)](https://david-dm.org/@zcorky/deep-diff-patch)
[![Build Status](https://travis-ci.com/zcorky/deep-diff-patch.svg?branch=master)](https://travis-ci.com/zcorky/deep-diff-patch)
![license](https://img.shields.io/github/license/zcorky/deep-diff-patch.svg)
[![issues](https://img.shields.io/github/issues/zcorky/deep-diff-patch.svg)](https://github.com/zcorky/deep-diff-patch/issues)

> Deep Diff & Patch in js, maybe data visition timeline json data is common for use.
> Diff => CREATE / UPDATE / DELETE / UNCHANGE Data.
> Patch => Immutable Philosophy Data.

### Install

```
$ npm install @zcorky/deep-diff-patch
```

### Usage

```javascript
// See more in test
import { diff, patch, Type } from '@zcorky/deep-diff-patch';

const prev = [
  {
    id: 76,
    name: 'Jay',
    createdAt: '...',
    updatedAt: '...',
  },
  {
    id: 77,
    name: 'Zero',
    createdAt: '...',
    updatedAt: '...',
  },
];

const next = [
  {
    id: 76,
    name: 'Jay',
    createdAt: '...',
    updatedAt: '...',
  },
  {
    id: 77,
    name: 'Zero Win',
    createdAt: '...',
    updatedAt: '...',
  },
];

diff(prev, next);

// =>
[
  {
    id: {
      type: Type.UNCHANGE,
      prev: 76,
      next: 76,
    },
    name: {
      type: Type.UNCHANGE,
      prev: 'Jay',
      next: 'Jay',
    },
    createdAt: {
      type: Type.UNCHANGE,
      prev: '...',
      next: '...',
    },
    updatedAt: {
      type: Type.UNCHANGE,
      prev: '...',
      next: '...',
    },
  },
  {
    id: {
      type: Type.UNCHANGE,
      prev: 77,
      next: 77,
    },
    name: {
      type: Type.UPDATE,
      prev: 'Zero',
      next: 'Zero Win',
    },
    createdAt: {
      type: Type.UNCHANGE,
      prev: '...',
      next: '...',
    },
    updatedAt: {
      type: Type.UNCHANGE,
      prev: '...',
      next: '...',
    },
  },
]
```

### Related
* [JavaScript专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)
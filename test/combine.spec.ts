import { expect } from 'chai';
// import * as window from 'global/window';

import { diff, patch } from '../src/index';

describe('deep diff', () => {
  // same deep & same primitive & same type
  it('deep & primitive & type', () => {
    const prev = '123';
    const next = '456';
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  // same deep & same primitive & not same type
  it('deep & primitive & !type', () => {
    const prev = '123';
    const next = 456;
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & object', () => {
    const prev = { x: { a: 123, b: 456 } }
    const next = { x: { a: 123, b: 789 } }
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & array', () => {
    const prev = { x: [1, 2, 3] }
    const next = { x: [1, 4, 3] }
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & object & array', () => {
    const prev = { x: { a: [1, 2, 3] } }
    const next = { x: { a: [1, 4, 3] } }
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & array & object', () => {
    const prev = [{ x: 1, y: 2 }, { a: 3, b: 4 }];
    const next = [{ x: 2, y: 2 }, { a: 3, b: 4 }];
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & array & object & netest', () => {
    const prev = { root: [{ x: 1, y: 2 }, { a: 3, b: 4 }] };
    const next = { root: [{ x: 2, y: 2 }, { a: 3, b: 4 }] };
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & array & object & netest & delete primitive', () => {
    const prev = { root: [{ x: 1, y: 2 }, { a: 3, b: 4 }] };
    const next = { root: [{ x: 2 }, { b: 4 }] };
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & array & object & netest & delete object & array', () => {
    const prev = { root: [{ x: 1, y: { o: 1 } }, { a: [{ m: 2 }], b: 4 }] };
    const next = { root: [{ x: 2 }, { b: 4 }] };
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & array & object & netest & create object & array', () => {
    const prev = { root: [{ x: 1 }, { b: 4 }] };
    const next = { root: [{ x: 2, y: { o: 1 } }, { a: [{ m: 2 }], b: 4 }] };
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('deep & array & object & netest & create&delete object & array', () => {
    const prev = { root: [{ x: 1, z: { k: 1 } }, { b: 4, c: [{ i: 1 }, { j: 2 }] }] };
    const next = { root: [{ x: 2, y: { o: 1 } }, { a: [{ m: 2 }], b: 4, c: [{ i: 1 }] }] };
    const diffs = diff(prev, next);

    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  // different deep
  it('!deep', () => {
    const prev = {
      a: {
        x: [1, 2, 3, 4],
        y: {
          i: 1,
          b: 2,
          z: 3,
          k: true,
          n: true,
          unchange: false,
          undefinedUnchange: undefined,
        },
      },
      c: {
        x: [1, 2, 3, 4],
        y: {
          i: 1,
          b: 2,
          z: 3,
        },
      },
    };

    const next = {
      a: {
        x: [1, '2'],
        y: {
          i: 1,
          m: 'create',
          b: 'update',
          k: true,
          n: false,
          // z: 'delete',
          unchange: false,
          undefinedUnchange: undefined,
        },
      },
      b: {
        x: [1, 2, 3, 4],
        y: {
          i: 1,
          b: 2,
          z: 3,
        },
      },
    };

    const diffs = diff(prev, next);

    // console.log(JSON.stringify(diffs, null, 2));

    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });
});

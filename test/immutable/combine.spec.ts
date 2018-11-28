import { expect } from 'chai';
// import * as window from 'global/window';

import { diff, patch } from '../../src/immutable';

describe('immutable diff & patch', () => {
  // unpatch
  it('unchange primitive patch', () => {
    const prev = '123';
    const diffs = { };
    const next = patch(prev, diffs);
    expect(next === prev).to.equal(true);
    expect(next === '123').to.equal(true);
  })

  // same deep & same primitive & same type
  it('primitive & type', () => {
    const prev = '123';
    const next = '456';
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  }); // NEW

  // same deep & same primitive & not same type
  it('primitive & !type', () => {
    const prev = '123';
    const next = 456;
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(next);
  });

  it('same', () => {
    const prev = { x: { a: 123, b: 456 } }
    const next = prev;
    const diffs = diff(prev, next);
    expect(diffs).to.be.equal(false);

    const _next = patch(prev, diffs);
    expect(_next).to.deep.equal(prev);
    expect(_next === prev).to.be.equal(true);
  });

  it('object & shallowCopy', () => {
    const prev = { x: { a: 123, b: 456 } }
    const next = { ...prev };
    const diffs = diff(prev, next);
    expect(diffs).to.be.not.equal(false);

    const _next = patch(prev, diffs);
    expect(_next === next).to.be.equal(false);
    expect(_next).to.deep.equal(next);
    expect(_next === prev).to.be.equal(false);
    expect(_next).to.deep.equal(prev);
  });

  it('array & shallowCopy', () => {
    const prev = [1, 2, 3];
    const next = [...prev];

    const diffs = diff(prev, next);
    expect(diffs).to.be.not.equal(false);

    const _next = patch(prev, diffs);
    expect(_next === next).to.be.equal(false);
    expect(_next).to.deep.equal(next);
    expect(_next === prev).to.be.equal(false);
    expect(_next).to.deep.equal(prev);
  });

  it('object & array && shallowCopy', () => {
    const prev = { x: { a: [1, 2, 3] } };
    const next = { x: { a: [...prev.x.a] } };
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);

    expect(_next).to.deep.equal(next);
    expect(_next).to.deep.equal(prev);
    // @TODO TYPES
    expect((_next as any).x !== next.x).to.be.equal(true);
    expect((_next as any).x.a !== next.x.a).to.be.equal(true);
    expect((_next as any).x !== prev.x).to.be.equal(true);
    expect((_next as any).x.a !== prev.x.a).to.be.equal(true);
  });

  it('deep & array & object', () => {
    const prev = [{ x: 1, y: 2 }, { a: 3, b: 4 }];
    // const __next = [{ x: 2, y: 2 }, { a: 3, b: 4 }];
    const next = prev.map((e, index) => index === 0 ? { ...e, x: 2 } : e);
    const diffs = diff(prev, next);
    const _next = patch(prev, diffs);

    expect(_next).to.deep.equal(next);
    expect(_next).to.deep.not.equal(prev);
    // @TODO TYPES
    expect((_next as any)[0] !== next[0]).to.be.equal(true);
    expect((_next as any)[0]).to.be.deep.equal(next[0]);
    expect((_next as any)[1] === next[1]).to.be.equal(true);
    expect((_next as any)[0] !== prev[0]).to.be.equal(true);
    expect((_next as any)[1] === prev[1]).to.be.equal(true);
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

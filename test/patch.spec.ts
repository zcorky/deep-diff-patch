import { expect } from 'chai';
// import * as window from 'global/window';

import { Type, patch } from '../src/index';

describe('deep patch', () => {
  // unpatch
  it('unchange primitive', () => {
    const prev = '123';
    const diffs = { };
    const next = patch(prev, diffs);
    expect(next).to.deep.equal('123');
  })

  // same deep & same primitive & same type
  it('deep & primitive & type', () => {
    const prev = '123';
    const diffs = { type: Type.UPDATE, prev: '123', next: '456' };
    const next = patch(prev, diffs);
    expect(next).to.deep.equal('456');
  });

  // same deep & same primitive & not same type
  it('deep & primitive & !type', () => {
    const prev = '123';
    const diffs = { type: Type.UPDATE, prev: '123', next: 456 };
    const next = patch(prev, diffs);

    expect(next).to.deep.equal(456);
  });

  it('deep & object', () => {
    const prev = { x: { a: 123, b: 456 } }
    const diffs = {
      x: {
        a: {
          type: Type.UNCHANGE,
          prev: 123,
          next: 123,
        },
        b: {
          type: Type.UPDATE,
          prev: 456,
          next: 789,
        },
      },
    };

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ x: { a: 123, b: 789 } });
  });

  it('deep & array', () => {
    const prev = { x: [1, 2, 3] }
    const diffs = {
      x: [{
        type: Type.UNCHANGE,
        prev: 1,
        next: 1,
      }, {
        type: Type.UPDATE,
        prev: 2,
        next: 4,
      }, {
        type: Type.UNCHANGE,
        prev: 3,
        next: 3,
      }],
    };

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ x: [1, 4, 3] });
  });

  it('deep & object & array', () => {
    const prev = { x: { a: [1, 2, 3] } }
    const diffs = {
      x: {
        a: [{
          type: Type.UNCHANGE,
          prev: 1,
          next: 1,
        }, {
          type: Type.UPDATE,
          prev: 2,
          next: 4,
        }, {
          type: Type.UNCHANGE,
          prev: 3,
          next: 3,
        }],
      },
    }

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ x: { a: [1, 4, 3] } });
  });

  it('deep & array & object', () => {
    const prev = [{ x: 1, y: 2 }, { a: 3, b: 4 }];
    const diffs = [{
      x: {
        type: Type.UPDATE,
        prev: 1, next: 2,
      },
      y: {
        type: Type.UNCHANGE,
        prev: 2, next: 2,
      },
    }, {
      a: {
        type: Type.UNCHANGE,
        prev: 3, next: 3,
      },
      b: {
        type: Type.UNCHANGE,
        prev: 4, next: 4,
      },
    }];

    const next = patch(prev, diffs);
    expect(next).to.deep.equal([{ x: 2, y: 2 }, { a: 3, b: 4 }]);
  });

  it('deep & array & object & netest', () => {
    const prev = { root: [{ x: 1, y: 2 }, { a: 3, b: 4 }] };
    const diffs = {
      root: [{
        x: {
          type: Type.UPDATE,
          prev: 1, next: 2,
        },
        y: {
          type: Type.UNCHANGE,
          prev: 2, next: 2,
        },
      }, {
        a: {
          type: Type.UNCHANGE,
          prev: 3, next: 3,
        },
        b: {
          type: Type.UNCHANGE,
          prev: 4, next: 4,
        },
      }],
    };

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ root: [{ x: 2, y: 2 }, { a: 3, b: 4 }] });
  });

  it('deep & array & object & netest & delete primitive', () => {
    const prev = { root: [{ x: 1, y: 2 }, { a: 3, b: 4 }] };
    const diffs = {
      root: [{
        x: {
          type: Type.UPDATE,
          prev: 1, next: 2,
        },
        y: {
          type: Type.DELETE,
          prev: 2, next: undefined,
        },
      }, {
        a: {
          type: Type.DELETE,
          prev: 3, next: undefined,
        },
        b: {
          type: Type.UNCHANGE,
          prev: 4, next: 4,
        },
      }],
    };

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ root: [{ x: 2 }, { b: 4 }] });
  });

  it('deep & array & object & netest & delete object & array', () => {
    const prev = { root: [{ x: 1, y: { o: 1 } }, { a: [{ m: 2 }], b: 4 }] };
    const diffs = {
      root: [{
        x: {
          type: Type.UPDATE,
          prev: 1, next: 2,
        },
        y: {
          type: Type.DELETE,
          prev: { o: 1 }, next: undefined,
        },
      }, {
        a: {
          type: Type.DELETE,
          prev: [{ m: 2 }], next: undefined,
        },
        b: {
          type: Type.UNCHANGE,
          prev: 4, next: 4,
        },
      }],
    };

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ root: [{ x: 2 }, { b: 4 }] });
  });

  it('deep & array & object & netest & create object & array', () => {
    const prev = { root: [{ x: 1 }, { b: 4 }] };
    const diffs = {
      root: [{
        x: {
          type: Type.UPDATE,
          prev: 1, next: 2,
        },
        y: {
          type: Type.CREATE,
          prev: undefined, next: { o: 1 },
        },
      }, {
        a: {
          type: Type.CREATE,
          prev: undefined, next: [{ m: 2 }],
        },
        b: {
          type: Type.UNCHANGE,
          prev: 4, next: 4,
        },
      }],
    };

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ root: [{ x: 2, y: { o: 1 } }, { a: [{ m: 2 }], b: 4 }] });
  });

  it('deep & array & object & netest & create&delete object & array', () => {
    const prev = { root: [{ x: 1, z: { k: 1 } }, { b: 4, c: [{ i: 1 }, { j: 2 }] }] };
    const diffs = {
      root: [{
        x: {
          type: Type.UPDATE,
          prev: 1, next: 2,
        },
        z: {
          type: Type.DELETE,
          prev: { k: 1 }, next: undefined,
        },
        y: {
          type: Type.CREATE,
          prev: undefined, next: { o: 1 },
        },
      }, {
        a: {
          type: Type.CREATE,
          prev: undefined, next: [{ m: 2 }],
        },
        c: [{
          i: {
            type: Type.UNCHANGE,
            prev: 1, next: 1,
          },
        }, {
          type: Type.DELETE,
          prev: { j: 2 }, next: undefined,
        }],
        b: {
          type: Type.UNCHANGE,
          prev: 4, next: 4,
        },
      }],
    };

    const next = patch(prev, diffs);
    expect(next).to.deep.equal({ root: [{ x: 2, y: { o: 1 } }, { a: [{ m: 2 }], b: 4, c: [{ i: 1 }] }] });
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

    const diffs = {
      a: {
        x: [{
          type: Type.UNCHANGE,
          prev: 1,
          next: 1,
        }, {
          type: Type.UPDATE,
          prev: 2,
          next: '2',
        }, {
          type: Type.DELETE,
          prev: 3,
          next: undefined,
        }, {
          type: Type.DELETE,
          prev: 4,
          next: undefined,
        }],
        y: {
          i: {
            type: Type.UNCHANGE,
            prev: 1,
            next: 1,
          },
          m: {
            type: Type.CREATE,
            prev: undefined,
            next: 'create',
          },
          b: {
            type: Type.UPDATE,
            prev: 2,
            next: 'update',
          },
          z: {
            type: Type.DELETE,
            prev: 3,
            next: undefined,
          },
          k: {
            type: Type.UNCHANGE,
            prev: true,
            next: true,
          },
          n: {
            type: Type.UPDATE,
            prev: true,
            next: false,
          },
          unchange: {
            type: Type.UNCHANGE,
            prev: false,
            next: false,
          },
          undefinedUnchange: {
            type: Type.UNCHANGE,
            prev: undefined,
            next: undefined,
          },
        },
      },
      c: {
        type: Type.DELETE,
        prev: {
          x: [1, 2, 3, 4],
          y: {
            i: 1,
            b: 2,
            z: 3,
          },
        },
        next: undefined,
      },
      b: {
        type: Type.CREATE,
        prev: undefined,
        next: {
          x: [1, 2, 3, 4],
          y: {
            i: 1,
            b: 2,
            z: 3,
          },
        },
      },
    };

    const next = patch(prev, diffs);

    // console.log(JSON.stringify(diffs, null, 2));

    expect(next).to.deep.equal({
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
    });
  });
});

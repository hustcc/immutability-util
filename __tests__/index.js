/**
 * Created by hustcc
 */

import iu from '../src/';
const original = require('./original.js');

describe('immutability-util', function() {

  describe('$apply', function() {
    require('./$apply.spec.js')(iu);
  });

  describe('$merge', function() {
    require('./$merge.spec.js')(iu);
  });

  describe('$push', function() {
    require('./$push.spec.js')(iu);
  });

  describe('$set', function() {
    require('./$set.spec.js')(iu);
  });

  describe('$splice', function() {
    require('./$splice.spec.js')(iu);
  });

  describe('$unset', function() {
    require('./$unset.spec.js')(iu);
  });

  describe('$unshift', function() {
    require('./$unshift.spec.js')(iu);
  });

  describe('works with symbols', function() {
    require('./symbols.spec.js')(iu);
  });

  describe('deep update', function() {
    const state = iu(original)
      .$apply('a', v => v + 1)
      .$merge('c.e.g', { m: 'update'})
      .$push('c.e.f', [7, 8, 9])
      .$set('c.i.j', 'hello node 8.')
      .$splice('c.i.k', [[1, 1, 10]])
      .$unset('c', ['d'])
      .$unshift('c.i.l', [13])
      .value();

    // keeps reference equality
    expect(original.a).not.toBe(state.a);
    expect(original.c.e.g).not.toBe(state.c.e.g);
    expect(original.c.e.f).not.toBe(state.c.e.f);
    expect(original.c.e).not.toBe(state.c.e);
    expect(original.c).not.toBe(state.c);
    expect(original.c.i.j).not.toBe(state.c.i.j);
    expect(original.c.i).not.toBe(state.c.i);
    expect(original.c.i.l).not.toBe(state.c.i.l);
    expect(original.c.i.k).not.toBe(state.c.i.k);
    expect(original).not.toBe(state);

    expect(original.b).toBe(state.b);

    expect(state).toEqual({
      a: 2,
      b: 2,
      c: {
        e: {
          f: [4, 5, 6, 7, 8, 9],
          g: {
            h: 'iu',
            m: 'update',
          },
        },
        i: {
          j: 'hello node 8.',
          k: [7, 10, 9],
          l: [13, 10, 11, 12],
        }
      },
    });
  });

  test('pathstring with array index', function() {
    const oldState = {
      a: {
        b: [{
          c: [1, 2, 3],
        }, {
          d: 4,
        }, {
          e: [5, 6],
        }]
      }
    };
    const state = iu(oldState)
      .$apply('a.b[1].d', v => v + 1)
      .$push('a.b[0].c', [4])
      .$set('a.b[2].e.[0]', 'hello node 8.')
      .value();

    // keeps reference equality
    expect(oldState.a).not.toBe(state.a);
    expect(oldState.a.b).not.toBe(state.a.b);
    expect(oldState.a.b[0]).not.toBe(state.a.b[0]);

    expect(state).toEqual({
      a: {
        b: [{
          c: [1, 2, 3, 4],
        }, {
          d: 5,
        }, {
          e: ['hello node 8.', 6],
        }]
      }
    });
  });

  test('should perform safe hasOwnProperty check', function() {
    expect(iu({}).$set('', {hasOwnProperty : 'a'}).value()).toEqual({
      'hasOwnProperty': 'a',
    });
  });

  test('deep update with new iu instance', function() {
    const state = iu(original, true)
      .$apply('a', v => v + 1)
      .$merge('c.e.g', { m: 'update'})
      .$push('c.e.f', [7, 8, 9])
      .$set('c.i.j', 'hello node 8.')
      .$splice('c.i.k', [[1, 1, 10]])
      .$unset('c', ['d'])
      .$unshift('c.i.l', [13])
      .value();

    // keeps reference equality
    expect(original.a).not.toBe(state.a);
    expect(original.c.e.g).not.toBe(state.c.e.g);
    expect(original.c.e.f).not.toBe(state.c.e.f);
    expect(original.c.e).not.toBe(state.c.e);
    expect(original.c).not.toBe(state.c);
    expect(original.c.i.j).not.toBe(state.c.i.j);
    expect(original.c.i).not.toBe(state.c.i);
    expect(original.c.i.l).not.toBe(state.c.i.l);
    expect(original.c.i.k).not.toBe(state.c.i.k);
    expect(original).not.toBe(state);

    expect(original.b).toBe(state.b);

    expect(state).toEqual({
      a: 2,
      b: 2,
      c: {
        e: {
          f: [4, 5, 6, 7, 8, 9],
          g: {
            h: 'iu',
            m: 'update',
          },
        },
        i: {
          j: 'hello node 8.',
          k: [7, 10, 9],
          l: [13, 10, 11, 12],
        }
      },
    });
  });
});
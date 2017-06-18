/**
 * Created by hustcc
 */
const original = require('./original.js');

module.exports = iu => {
  test('1.sets', function() {
    expect(iu(original).$set('c.i.k', 1).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 5, 6],
          g: {
            h: 'iu',
          },
        },
        i: {
          j: 'hello, world.',
          k: 1,
          l: [10, 11, 12],
        }
      },
    });
    expect(iu(original).$set('', {a: 1}).value()).toEqual({a: 1});
    expect(iu(original).$set('c.i.k', {a: 1}).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 5, 6],
          g: {
            h: 'iu',
          },
        },
        i: {
          j: 'hello, world.',
          k: {a: 1},
          l: [10, 11, 12],
        }
      },
    });
  });

  test('2.does not mutate the original object', function() {
    expect(iu(original).$set('', {a: 1}).value()).toEqual({a: 1});
    expect(original).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 5, 6],
          g: {
            h: 'iu',
          },
        },
        i: {
          j: 'hello, world.',
          k: [7, 8, 9],
          l: [10, 11, 12],
        }
      },
    });
  });
  test('3.keeps reference equality when possible', function() {
    expect(iu(original).$set('c.i.k', undefined).value()).not.toBe(original);
    expect(iu(original).$set('c.i.k', null).value()).not.toBe(original);

    expect(iu(original).$set('c.i.k', original.c.i.k).value()).toBe(original);

    expect(iu(original).$set('c.i.k', [1]).value().c.i.k).not.toBe(original.c.i.k);
    expect(iu(original).$set('c.i.k', [1]).value().c.i).not.toBe(original.c.i);
    expect(iu(original).$set('c.i.k', [1]).value().c).not.toBe(original.c);

    expect(iu(original).$set('c.i.k', [1]).value().c.e.f).toBe(original.c.e.f);
  });
  test('4.path string / array.', function() {
    expect(iu(original).$set(['c', 'i', 'k'], 1).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 5, 6],
          g: {
            h: 'iu',
          },
        },
        i: {
          j: 'hello, world.',
          k: 1,
          l: [10, 11, 12],
        }
      },
    });
    expect(iu(original).$set([], {a: 1}).value()).toEqual({a: 1});
  });
};
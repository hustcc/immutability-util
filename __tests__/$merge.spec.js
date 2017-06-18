/**
 * Created by hustcc
 */

const original = require('./original.js');

module.exports = iu => {
  test('1.merges', function() {
    expect(iu(original).$merge('', {d: 'd'}).value()).toEqual({
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
      d: 'd',
    });
  });

  test('2.does not mutate the original object', function() {
    iu(original).$merge('', {d: 'd'}).value();
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

  test('3.only merges with an object', function() {
    expect(iu(original).$merge.bind(null, 'c.g', 'iu')).toThrow(
      'iu(): expected value of $merge to be an \'object\'; got iu.',
    );
  });

  test('4.only merges into an object', function() {
    expect(iu(original).$merge.bind(null, 'a', {d: 'iu'})).toThrow(
      'iu(): expected target of $merge to be an \'object\'; got 1.',
    );
  });

  test('5.keeps reference equality when possible', function() {
    expect(iu(original).$merge('c', {}).value()).toBe(original);

    expect(iu(original).$merge('c.i', original.c.i).value()).toBe(original);

    // Merging primatives of the same value should return the original.
    expect(iu(original).$merge('c.i', {j: 'hello, world.'}).value()).toBe(original);

    // Two objects are different values even though they are deeply equal.
    expect(iu(original).$merge('c.i', {
      j: 'hello, world.',
      k: [7, 8, 9],
      l: [10, 11, 12],
    }).value()).not.toBe(original);

    expect(iu(original).$merge('c.e.g', { h: original.c.e.g.h, c: false }).value()).not.toBe(original);

    expect(iu(original).$merge('c.i', {a: 1}).value().c.i).not.toBe(original.c.i);
    expect(iu(original).$merge('c.i', {a: 1}).value().c).not.toBe(original.c);

    expect(iu(original).$merge('c.i', {a: 1}).value().c.e.f).toBe(original.c.e.f);
  });

  test('6. string / array path.', function() {
    expect(iu(original).$merge('c.e.g', {c: false}).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 5, 6],
          g: {
            h: 'iu',
            c: false
          },
        },
        i: {
          j: 'hello, world.',
          k: [7, 8, 9],
          l: [10, 11, 12],
        }
      },
    });
    expect(iu(original).$merge(['c', 'e', 'g'], {c: false}).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 5, 6],
          g: {
            h: 'iu',
            c: false
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
};
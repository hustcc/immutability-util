/**
 * Created by hustcc
 */

const original = require('./original.js');

module.exports = iu => {
  test('1.$push', function() {
    expect(iu(original).$push('c.e.f', [7]).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 5, 6, 7],
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
    expect(iu([1, 2]).$push('', [7]).value()).toEqual([1, 2, 7]);
  });

  test('2.does not mutate the original object', function() {
    iu(original).$push('c.e.f', [7]).value();
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

  test('3.only pushes an array', function() {
    expect(iu(original).$push.bind(null, 'c.e.f', 7)).toThrow(
      'iu(): expected value of $push to be an array; got 7. Did you ' +
      'forget to wrap your parameters in an array?'
    );
  });

  test('4.only pushes unto an array', function() {
    expect(iu(original).$push.bind(null, 'c.d', [7])).toThrow(
      'iu(): expected target of $push to be an array; got 3.'
    );
  });

  test('5.keeps reference equality when possible', function() {
    expect(iu(original).$push('c.i.k', []).value()).toBe(original);

    expect(iu(original).$push('c.i.k', original.c.i.k).value()).not.toBe(original);

    expect(iu(original).$push('c.i.k', [false]).value()).not.toBe(original);

    expect(iu(original).$push('c.i.k', [1]).value().c.i.k).not.toBe(original.c.i.k);
    expect(iu(original).$push('c.i.k', [1]).value().c.i).not.toBe(original.c.i);
    expect(iu(original).$push('c.i.k', [1]).value().c).not.toBe(original.c);

    expect(iu(original).$push('c.i.k', [1]).value().c.e.f).toBe(original.c.e.f);
  });

  test('6. string / array path.', function() {
    expect(iu(original).$push('c.i.k', [7]).value()).toEqual({
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
          k: [7, 8, 9, 7],
          l: [10, 11, 12],
        }
      },
    });
    expect(iu(original).$push(['c', 'i', 'k'], [7]).value()).toEqual({
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
          k: [7, 8, 9, 7],
          l: [10, 11, 12],
        }
      },
    });
  });
};
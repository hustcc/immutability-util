/**
 * Created by hustcc
 */
const original = require('./original.js');

module.exports = iu => {
  test('1.splices', function() {
    expect(iu(original).$splice('c.e.f', [[1, 1, 2]]).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 2, 6],
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
    expect(iu([1, 2, 7]).$splice('', [[1, 1, 3]]).value()).toEqual([1, 3, 7]);
    expect(iu([1, 2, 7]).$splice('', [[1, 1, 3], [2, 0, 4]]).value()).toEqual([1, 3, 4, 7]);
  });
  test('2.does not mutate the original object', function() {
    iu(original).$splice('c.e.f', [[1, 1, 2]]).value()
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

  test('3.only splices an array of arrays', function() {
    expect(iu(original).$splice.bind(null, 'c.e.f', 'hello')).toThrow(
      'iu(): expected value of $splice to be an array of arrays; got hello. Did you ' +
      'forget to wrap your parameters in an array?'
    );
    expect(iu(original).$splice.bind(null, 'c.e.f', [1, 2, 1])).toThrow(
      'iu(): expected value of $splice to be an array of arrays; got 1. Did you ' +
      'forget to wrap your parameters in an array?'
    );
  });

  test('4.only splices unto an array', function() {
    expect(iu(original).$splice.bind(null, 'c.d', [1, 1, 2])).toThrow(
      'iu(): expected target of $splice to be an array; got 3.'
    );
  });

  test('5.keeps reference equality when possible', function() {
    expect(iu(original).$splice('c.i.k', []).value()).toBe(original);

    expect(iu(original).$splice('c.i.k', [original.c.i.k]).value()).not.toBe(original);

    expect(iu(original).$splice('c.i.k', [[]]).value()).toBe(original);

    expect(iu(original).$splice('c.i.k', [[1, 1, 2]]).value().c.i.k).not.toBe(original.c.i.k);
    expect(iu(original).$splice('c.i.k', [[1, 1, 2]]).value().c.i).not.toBe(original.c.i);
    expect(iu(original).$splice('c.i.k', [[1, 1, 2]]).value().c).not.toBe(original.c);

    expect(iu(original).$splice('c.i.k', [[1, 1, 2]]).value().c.e.f).toBe(original.c.e.f);
  });

  test('6.path string / array', function() {
    expect(iu(original).$splice(['c', 'e', 'f'], [[1, 1, 2]]).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
          f: [4, 2, 6],
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
    expect(iu([1, 2, 7]).$splice([], [[1, 1, 3]]).value()).toEqual([1, 3, 7]);
  });
};
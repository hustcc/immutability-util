/**
 * Created by hustcc
 */

const original = require('./original.js');

module.exports = iu => {
  var applier = function (n) {
    return n * 2;
  };

  test('1.applies', function () {
    expect(iu(original).$apply('a', applier).value()).toEqual({
      a: 2,
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

  test('2.does not mutate the original object', function () {
    iu(original).$apply('a', applier).value();
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

  test('3.only applies a function', function() {
    expect(iu({v: 2}).$apply.bind(null, '', 4)).toThrow(
      'iu(): expected target of $apply to be a function; got 4.'
    );
  });

  test('4.$apply path string / array', function () {
    expect(iu(original).$apply('c.d', node => node * 2 ).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 6,
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
    expect(iu(original).$apply(['c', 'd'], applier).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 6,
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

  test('5.keeps reference equality when possible', function () {
    function identity(val) {
      return val;
    }
    expect(iu(original).$apply('c.d', identity).value()).toBe(original); // do not change the value.

    expect(iu(original).$apply('c.d', applier).value()).not.toBe(original);
    expect(iu(original).$apply('c.d', applier).value().c).not.toBe(original.c);
    expect(iu(original).$apply('c.d', applier).value().c.d).not.toBe(original.c.d);

    expect(iu(original).$apply('c.d', applier).value().c.e.f).toBe(original.c.e.f);
  });
};
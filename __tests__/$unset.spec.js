/**
 * Created by hustcc
 */

const original = require('./original.js');

module.exports = iu => {
  test('1.unsets', function() {
    expect(iu(original).$unset('', ['a']).value().a).toBe(undefined);
    expect(iu(original).$unset('c.e', ['f', 'g']).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
        },
        i: {
          j: 'hello, world.',
          k: [7, 8, 9],
          l: [10, 11, 12],
        }
      },
    });
  });

  test('2.removes multiple keys from the object', function() {
    const removed = iu(original).$unset('', ['a', 'b']).value();
    expect('a' in removed).toBe(false);
    expect('b' in removed).toBe(false);
    expect('c' in removed).toBe(true);
  });

  test('3.remove keys must be array', function() {
    expect(iu(original).$unset.bind(null, '', 'a')).toThrow(
      'iu(): expected value of $unset to be an array; got a. Did you forget to wrap your parameters in an array?',
    );
  });

  test('4.does not remove keys from the inherited properties', function() {
    function Parent() { this.foo = 'Parent'; }
    function Child() {}
    Child.prototype = new Parent();

    const child = new Child();
    expect(iu(child).$unset('', ['foo']).value().foo).toEqual('Parent');
  });

  test('5.keeps reference equality when possible', function() {
    expect(iu(original).$unset('', ['z']).value()).toBe(original);
    expect(iu(original).$unset('', ['a']).value()).not.toBe(original);

    expect(iu(original).$unset('c.e', ['z']).value()).toBe(original);
    expect(iu(original).$unset('c.e', ['f']).value().c.e).not.toBe(original.c.e);
    expect(iu(original).$unset('c.e', ['f']).value().c).not.toBe(original.c);
    expect(iu(original).$unset('c.e', ['f']).value()).not.toBe(original);

    expect(iu(original).$unset('c.e', ['f']).value().c.i).toBe(original.c.i);
  });

  test('6.path string / array', function() {
    expect(iu(original).$unset([], ['a']).value().a).toBe(undefined);
    expect(iu(original).$unset(['c', 'e'], ['f', 'g']).value()).toEqual({
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: {
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
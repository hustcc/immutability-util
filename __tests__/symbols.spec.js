/**
 * Created by hustcc
 */

module.exports = iu => {
  if (typeof Symbol === 'function' && Symbol('TEST').toString() === 'Symbol(TEST)') {
    test('1.in the source object', function () {
      const obj = {a: 1};
      obj[Symbol.for('b')] = 2;
      expect(iu(obj).$set('c', 3).value()[Symbol.for('b')]).toEqual(2);
    });
    test('2.in the spec object', function () {
      const obj = {a: 1};
      obj[Symbol.for('b')] = 2;
      const spec = {};
      spec[Symbol.for('b')] = {$set: 2};
      expect(iu(obj).$set([Symbol.for('b')], 2).value()[Symbol.for('b')]).toEqual(2);
    });
    test('3.in the $merge command', function () {
      const obj = {a: 1};
      obj[Symbol.for('b')] = {c: 3};
      obj[Symbol.for('d')] = 4;

      const tobeMerge = {};
      tobeMerge[Symbol.for('e')] = 5;

      const updated = iu(obj).$merge([Symbol.for('b')], tobeMerge).value()
      expect(updated[Symbol.for('b')][Symbol.for('e')]).toEqual(5);
      expect(updated[Symbol.for('d')]).toEqual(4);
    });
  }
};
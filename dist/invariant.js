'use strict';

/**
 * Created by hustcc.
 *
 * from: https://github.com/zertosh/invariant/blob/master/invariant.js
 */

module.exports = function (condition, format) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  if (!condition && format) {
    var index = -1;
    var error = new Error(format.replace(/%s/g, function () {
      return args[index += 1];
    }));
    error.name = 'Invariant Violation';
    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};
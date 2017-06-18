/**
 * Created by hustcc.
 *
 * from: https://github.com/zertosh/invariant/blob/master/invariant.js
 */

module.exports = (condition, format, ...args) => {
  if (!condition && format) {
    let index = -1;
    const error = new Error(
      format.replace(/%s/g, () => args[index += 1])
    );
    error.name = 'Invariant Violation';
    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

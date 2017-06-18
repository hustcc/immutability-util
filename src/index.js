/**
 * Copyright (c) 2017 hustcc
 * License: MIT
 * GitHub: https://github.com/hustcc/immutability-util
 *
 * Inspired by:
 *
 * https://github.com/kolodny/immutability-helper
 * https://github.com/ProtoTeam/immutability-helper-x
 *
 * [Notice]
 * Version 0.0.x -> 0.1.x
 * Copy the data when using the methods, and the `value()` API only return the current state which is immutable.
 * When call multiple methods, will has repeated data copy.
 *
 * Version 0.2.x (TODO)
 * Only save the path array and value, and copy the data when calling `value()` API.
 * Only do data copy once on the node, will get much more performance.
 *
 **/

const invariant = require('./invariant.js');

class ImmutabilityUtil {
  /**
   * @param state
   */
  constructor(state = {}) {
    this.state = state; // state data

    this.commands = this._commands();
  }

  _commands = () => ({
    $apply: (value, origin) => {
      this._invariantApply(value);

      return value(origin);
    },
    $merge: (value, origin) => {
      this._invariantMerge(value, origin);

      let next = origin;
      this._allKeys(value).forEach((key) => {
        if (value[key] !== next[key]) {
          if (next === origin) next = this._copy(origin);
          next[key] = value[key];
        }
      });
      return next;
    },
    $push: (value, origin) => {
      this._invariantPushAndUnshift(value, origin, '$push');

      return value.length ? origin.concat(value) : origin;
    },
    $set: value => value,
    $splice: (value, origin) => {
      this._invariantSplices(value, origin);

      let next = origin;
      value.forEach((splice) => {
        this._invariantSplice(splice);
        if (next === origin && splice.length) next = this._copy(origin);
        Array.prototype.splice.apply(next, splice);
      });
      return next;
    },
    $unset: (value, origin) => {
      this._invariantUnset(value);

      let next = origin;
      value.forEach((key) => {
        if (Object.hasOwnProperty.call(next, key)) {
          if (next === origin) next = this._copy(origin);
          delete next[key];
        }
      });
      return next;
    },
    $unshift: (value, origin) => {
      this._invariantPushAndUnshift(value, origin, '$unshift');

      return value.length ? value.concat(origin) : origin;
    },
  });

  /**
   * Clone object.
   * @param object
   * @returns {*}
   * @private
   */
  _copy = (object) => {
    if (object instanceof Array) return object.slice();
    else if (object && typeof object === 'object') return Object.assign(new object.constructor(), object);
    return object;
  };

  /**
   * Get all keys of object. Symbols supported.
   * @param obj
   * @returns {*}
   * @private
   */
  _allKeys = (obj) => {
    if (typeof Object.getOwnPropertySymbols === 'function') {
      return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
    }
    return Object.keys(obj);
  };

  /**
   * Get path array from path string.
   * path string is the string like `app.ui.data`, split by .
   * @param path
   * @returns {Array|*}
   * @private
   */
  _pathArray = (path) => {
    if (Array.isArray(path)) return path.filter(e => !!e);
    // [n] => .n
    path = path.replace(/(\[\d+\])/g, s => `.${s.slice(1, -1)}`);
    return path.split('.').filter(e => !!e);
  };

  /**
   * 核心处理函数
   * @param path
   * @param update
   * @param processor 处理的函数
   * @private
   */
  _process = (path, update, processor) => {
    path = this._pathArray(path);
    const length = path.length;

    // start to loop the path string.
    const _loop = (state, i) => {
      let nextState = state;

      if (i < length - 1) {
        i += 1;
        const key = path[i];
        const nextStateForKey = _loop(nextState[key], i);
        if (nextStateForKey !== nextState[key]) {
          if (nextState === state) {
            // console.log('copy', key);
            nextState = this._copy(state);
          }
          nextState[key] = nextStateForKey;
        }
      } else {
        nextState = processor(update, state);
      }
      return nextState;
    };

    this.state = _loop(this.state, -1);
  };

  /**
   * $apply
   * @param path
   * @param value
   * @returns {ImmutabilityUtil}
   */
  $apply = (path, value) => {
    this._process(path, value, this.commands.$apply);
    return this;
  };

  /**
   * $merge
   * @param path
   * @param value
   * @returns {ImmutabilityUtil}
   */
  $merge = (path, value) => {
    this._process(path, value, this.commands.$merge);
    return this;
  };

  /**
   * $push
   * @param path
   * @param value
   * @returns {ImmutabilityUtil}
   */
  $push = (path, value) => {
    this._process(path, value, this.commands.$push);
    return this;
  };

  /**
   * $set
   * @param path
   * @param value
   * @returns {ImmutabilityUtil}
   */
  $set =(path, value) => {
    this._process(path, value, this.commands.$set);
    return this;
  };

  /**
   * $splice
   * @param path
   * @param value
   * @returns {ImmutabilityUtil}
   */
  $splice = (path, value) => {
    this._process(path, value, this.commands.$splice);
    return this;
  };

  /**
   * $unset
   * @param path
   * @param value
   * @returns {ImmutabilityUtil}
   */
  $unset = (path, value) => {
    this._process(path, value, this.commands.$unset);
    return this;
  };

  /**
   * $unshift
   * @param path
   * @param value
   * @returns {ImmutabilityUtil}
   */
  $unshift = (path, value) => {
    this._process(path, value, this.commands.$unshift);
    return this;
  };

  /**
   * get the state value.
   * @returns {{}|*}
   */
  value = () => this.state;

  setState = (state) => {
    this.state = state;
    return this;
  };

  // invariants
  _invariantPushAndUnshift = (value, origin, command) => {
    invariant(
      Array.isArray(origin),
      'iu(): expected target of %s to be an array; got %s.',
      command,
      origin
    );
    invariant(
      Array.isArray(value),
      'iu(): expected value of %s to be an array; got %s. Did you forget to wrap your parameters in an array?',
      command,
      value
    );
  };

  _invariantSplices = (value, origin) => {
    invariant(
      Array.isArray(origin),
      'iu(): expected target of $splice to be an array; got %s.',
      origin
    );
    this._invariantSplice(value);
  };

  _invariantSplice = (value) => {
    invariant(
      Array.isArray(value),
      'iu(): expected value of $splice to be an array of arrays; got %s. ' +
      'Did you forget to wrap your parameters in an array?',
      value
    );
  };

  _invariantApply = (fn) => {
    invariant(
      typeof fn === 'function',
      'iu(): expected target of $apply to be a function; got %s.',
      fn
    );
  };

  _invariantMerge = (value, origin) => {
    invariant(
      value && typeof value === 'object',
      'iu(): expected value of $merge to be an \'object\'; got %s.',
      value
    );
    invariant(
      origin && typeof origin === 'object',
      'iu(): expected target of $merge to be an \'object\'; got %s.',
      origin
    );
  };

  _invariantUnset = (value) => {
    invariant(
      Array.isArray(value),
      'iu(): expected value of $unset to be an array; got %s. Did you forget to wrap your parameters in an array?',
      value
    );
  };
}

// 单例模式，提高性能
const instance = new ImmutabilityUtil();

/**
 * 库函数入口
 * @param state 需要被修改的 state 状态
 * @param newInstance 默认使用单例，提高性能
 * @returns {ImmutabilityUtil}
 */
const entry = (state, newInstance = false) => {
  if (newInstance) {
    return new ImmutabilityUtil(state);
  }
  return instance.setState(state);
};

module.exports = entry;

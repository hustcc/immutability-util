'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var invariant = require('./invariant.js');

var ImmutabilityUtil =
/**
 * @param state
 */
function ImmutabilityUtil() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, ImmutabilityUtil);

  _initialiseProps.call(this);

  this.state = state; // state data

  this.commands = this._commands();
}

/**
 * Clone object.
 * @param object
 * @returns {*}
 * @private
 */


/**
 * Get all keys of object. Symbols supported.
 * @param obj
 * @returns {*}
 * @private
 */


/**
 * Get path array from path string.
 * path string is the string like `app.ui.data`, split by .
 * @param path
 * @returns {Array|*}
 * @private
 */


/**
 * 核心处理函数
 * @param path
 * @param update
 * @param processor 处理的函数
 * @private
 */


/**
 * $apply
 * @param path
 * @param value
 * @returns {ImmutabilityUtil}
 */


/**
 * $merge
 * @param path
 * @param value
 * @returns {ImmutabilityUtil}
 */


/**
 * $push
 * @param path
 * @param value
 * @returns {ImmutabilityUtil}
 */


/**
 * $set
 * @param path
 * @param value
 * @returns {ImmutabilityUtil}
 */


/**
 * $splice
 * @param path
 * @param value
 * @returns {ImmutabilityUtil}
 */


/**
 * $unset
 * @param path
 * @param value
 * @returns {ImmutabilityUtil}
 */


/**
 * $unshift
 * @param path
 * @param value
 * @returns {ImmutabilityUtil}
 */


/**
 * get the state value.
 * @returns {{}|*}
 */


// invariants
;

// 单例模式，提高性能


var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this._commands = function () {
    return {
      $apply: function $apply(value, origin) {
        _this._invariantApply(value);

        return value(origin);
      },
      $merge: function $merge(value, origin) {
        _this._invariantMerge(value, origin);

        var next = origin;
        _this._allKeys(value).forEach(function (key) {
          if (value[key] !== next[key]) {
            if (next === origin) next = _this._copy(origin);
            next[key] = value[key];
          }
        });
        return next;
      },
      $push: function $push(value, origin) {
        _this._invariantPushAndUnshift(value, origin, '$push');

        return value.length ? origin.concat(value) : origin;
      },
      $set: function $set(value) {
        return value;
      },
      $splice: function $splice(value, origin) {
        _this._invariantSplices(value, origin);

        var next = origin;
        value.forEach(function (splice) {
          _this._invariantSplice(splice);
          if (next === origin && splice.length) next = _this._copy(origin);
          Array.prototype.splice.apply(next, splice);
        });
        return next;
      },
      $unset: function $unset(value, origin) {
        _this._invariantUnset(value);

        var next = origin;
        value.forEach(function (key) {
          if (Object.hasOwnProperty.call(next, key)) {
            if (next === origin) next = _this._copy(origin);
            delete next[key];
          }
        });
        return next;
      },
      $unshift: function $unshift(value, origin) {
        _this._invariantPushAndUnshift(value, origin, '$unshift');

        return value.length ? value.concat(origin) : origin;
      }
    };
  };

  this._copy = function (object) {
    if (object instanceof Array) return object.slice();else if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') return Object.assign(new object.constructor(), object);
    return object;
  };

  this._allKeys = function (obj) {
    if (typeof Object.getOwnPropertySymbols === 'function') {
      return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
    }
    return Object.keys(obj);
  };

  this._pathArray = function (path) {
    if (Array.isArray(path)) return path.filter(function (e) {
      return !!e;
    });
    // [n] => .n
    path = path.replace(/(\[\d+\])/g, function (s) {
      return '.' + s.slice(1, -1);
    });
    return path.split('.').filter(function (e) {
      return !!e;
    });
  };

  this._process = function (path, update, processor) {
    path = _this._pathArray(path);
    var length = path.length;

    // start to loop the path string.
    var _loop = function _loop(state, i) {
      var nextState = state;

      if (i < length - 1) {
        i += 1;
        var key = path[i];
        var nextStateForKey = _loop(nextState[key], i);
        if (nextStateForKey !== nextState[key]) {
          if (nextState === state) {
            // console.log('copy', key);
            nextState = _this._copy(state);
          }
          nextState[key] = nextStateForKey;
        }
      } else {
        nextState = processor(update, state);
      }
      return nextState;
    };

    _this.state = _loop(_this.state, -1);
  };

  this.$apply = function (path, value) {
    _this._process(path, value, _this.commands.$apply);
    return _this;
  };

  this.$merge = function (path, value) {
    _this._process(path, value, _this.commands.$merge);
    return _this;
  };

  this.$push = function (path, value) {
    _this._process(path, value, _this.commands.$push);
    return _this;
  };

  this.$set = function (path, value) {
    _this._process(path, value, _this.commands.$set);
    return _this;
  };

  this.$splice = function (path, value) {
    _this._process(path, value, _this.commands.$splice);
    return _this;
  };

  this.$unset = function (path, value) {
    _this._process(path, value, _this.commands.$unset);
    return _this;
  };

  this.$unshift = function (path, value) {
    _this._process(path, value, _this.commands.$unshift);
    return _this;
  };

  this.value = function () {
    return _this.state;
  };

  this.setState = function (state) {
    _this.state = state;
    return _this;
  };

  this._invariantPushAndUnshift = function (value, origin, command) {
    invariant(Array.isArray(origin), 'iu(): expected target of %s to be an array; got %s.', command, origin);
    invariant(Array.isArray(value), 'iu(): expected value of %s to be an array; got %s. Did you forget to wrap your parameters in an array?', command, value);
  };

  this._invariantSplices = function (value, origin) {
    invariant(Array.isArray(origin), 'iu(): expected target of $splice to be an array; got %s.', origin);
    _this._invariantSplice(value);
  };

  this._invariantSplice = function (value) {
    invariant(Array.isArray(value), 'iu(): expected value of $splice to be an array of arrays; got %s. ' + 'Did you forget to wrap your parameters in an array?', value);
  };

  this._invariantApply = function (fn) {
    invariant(typeof fn === 'function', 'iu(): expected target of $apply to be a function; got %s.', fn);
  };

  this._invariantMerge = function (value, origin) {
    invariant(value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object', 'iu(): expected value of $merge to be an \'object\'; got %s.', value);
    invariant(origin && (typeof origin === 'undefined' ? 'undefined' : _typeof(origin)) === 'object', 'iu(): expected target of $merge to be an \'object\'; got %s.', origin);
  };

  this._invariantUnset = function (value) {
    invariant(Array.isArray(value), 'iu(): expected value of $unset to be an array; got %s. Did you forget to wrap your parameters in an array?', value);
  };
};

var instance = new ImmutabilityUtil();

/**
 * 库函数入口
 * @param state 需要被修改的 state 状态
 * @param newInstance 默认使用单例，提高性能
 * @returns {ImmutabilityUtil}
 */
var entry = function entry(state) {
  var newInstance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (newInstance) {
    return new ImmutabilityUtil(state);
  }
  return instance.setState(state);
};

module.exports = entry;
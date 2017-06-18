/**
 * Created by xiaowei.wzw on 17/6/7.
 */
'use strict';

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var iu = require('../');
var ImmutabilityHelper = require('immutability-helper');

var obj = {
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
};

suite
  // code for ImmutabilityUtil
  .add('ImmutabilityUtil chain $apply', function () {
    iu(obj)
      .$apply(['a'], v => v + 1)
      .value()

  })
  // code for ImmutabilityHelper
  .add('ImmutabilityHelper $apply', function () {
    ImmutabilityHelper(obj, {
      a: {
        $apply: v => v + 1,
      },
    });
  })
  .on('cycle', function (e) {
    console.log('' + e.target);
  })
  .on('complete', function() {
    var fast = this.filter('fastest');
    var slow = this.filter('slowest');
    console.log('[OPS] ' +
      fast.map('name') + ' / ' + slow.map('name') +
      ' = ' +
      (fast.map('hz') / slow.map('hz')).toFixed(3) +
      '\n'
    );
  })
  .run();

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
  .add('immutability-util all', function () {
    iu(obj)
      .$apply(['a'], v => v + 1)
      .$merge(['c', 'e', 'g'], { m: 'update'})
      .$push(['c', 'e', 'f'], [7, 8, 9])
      .$set(['c', 'i', 'j'], 'hello node 8.')
      .$splice(['c', 'i', 'k'], [[1, 1, 10]])
      .$unset(['c'], ['d'])
      .$unshift(['c', 'i', 'l'], [13])
      .value()

  })
  // code for ImmutabilityHelper
  .add('immutability-helper all', function () {
    ImmutabilityHelper(obj, {
      a: {
        $apply: v => v + 1,
      },
      c: {
        e: {
          g: {
            $merge: { l: 'update'}
          },
          f: {
            $push: [7, 8, 9]
          },
        },
        i: {
          j: {
            $set: 'hello node 8.',
          },
          k: {
            $splice: [[1, 1, 10]],
          },
          l: {
            $unshift: [11],
          }
        },
        $unset: ['d'],
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

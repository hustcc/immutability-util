# immutability-util

> Mutate a copy of data without changing the original source. Inspired by [kolodny/immutability-helper](https://github.com/kolodny/immutability-helper) / [ProtoTeam/immutability-helper-x](https://github.com/ProtoTeam/immutability-helper-x) and rewrite with ES6 syntax for **convenient API** and **higher performance**.

[![Build Status](https://travis-ci.org/hustcc/immutability-util.svg?branch=master)](https://travis-ci.org/hustcc/immutability-util) [![Coverage Status](https://coveralls.io/repos/github/hustcc/immutability-util/badge.svg?branch=master)](https://coveralls.io/github/hustcc/immutability-util?branch=master) [![npm](https://img.shields.io/npm/v/immutability-util.svg)](https://www.npmjs.com/package/immutability-util) [![npm download](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/immutability-util)


## 1. Features

Features or key points.

1. Use **chainble API** to mutate a copy of object.
2. Simplify your code by finding target to be updated with **path string**.
3. Maybe can optimize your web app with a bit **higher performance**.


## 2. Install & Usage

Install with NPM.

```sh
npm install -S immutability-util
```

Then use it.

```js
const iu = require('immutability-util');
// or 
import iu from 'immutability-util';

// obj need to be mutated.
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

// chainable usage.
const state = iu(obj)
  .$apply(['a'], v => v + 1)
  .$merge(['c', 'e', 'g'], { m: 'update'})
  .$push(['c', 'e', 'f'], [7, 8, 9])
  .$set(['c', 'i', 'j'], 'hello node 8.')
  .$splice(['c', 'i', 'k'], [[1, 1, 10]])
  .$unset(['c'], ['d'])
  .$unshift(['c', 'i', 'l'], [13])
  .value(); // then get the mutated copy.
  
// or use path string.
iu(obj).$set('c.i.j', 'hello node 8.').value();
```

And process array like this:

```js
const obj = {
  a: {
    b: [{
      c: [1, 2, 3],
    }, {
      d: 4,
    }, {
      e: [5, 6],
    }]
  }
};
const state = iu(obj)
  .$apply('a.b[1].d', v => v + 1)
  .$push('a.b[0].c', [4])
  .$set('a.b[2].e[0]', 'hello node 8.')
  .value();
```


## 3. Available API

After got the instance of `ImmutabilityUtil`, you can use the chainable methods below.

 - `$apply(path, function)`: passes in the current value to the function and updates it with the new returned value.
 - `$merge(path, object)`: merge the keys of object with the target.
 - `$push(path, array)`: push() all the items in array on the target.
 - `$set(path, any)`: replace the target entirely.
 - `$splice(path, array of arrays)`: call splice() with the array of arrays on the target with the parameters provided by the item.
 - `$unset(path, array of strings)`: remove the list of keys in array from the target object.
 - `$unshift(path, array)`: unshift() all the items in array on the target.

~~~Also you can use API `update()`, and put **spec** into it, just like immutability-helper.~~~

Then you can use API `value()` to get the immutable data copy. All the value of method are compatible with `immutability-helper`.

Your pull requests are needed for more API.


## 4. Build & Test

You can develop and test as below.
```sh
npm run build
# run the testcases
npm run test
```

You can run `npm run benchmark` to get the comparison of performance.


## 5. License

MIT@[hustcc](https://github.com/hustcc).



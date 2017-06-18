/**
 * Created by xiaowei.wzw on 17/6/7.
 */

'use strict';

var os = require("os");
var WordTable = require('word-table');

var v8 = process.versions.v8;
var node = process.versions.node;


var header = ['benchmark platform device information.'];
var body = [
  [os.type() + ' ' + os.release() + ' ' + os.arch()],
  ['Node.JS ' + node],
  ['V8 ' + v8],
];


var cpus = os.cpus().map(function (cpu) {
  return cpu.model;
}).reduce(function (o, model) {
  if (!o[model]) o[model] = 0;
  o[model]++;
  return o;
}, {});



cpus = Object.keys(cpus).forEach(function (key) {
  body.push([key + ' \u00d7 ' + cpus[key]]);
});


console.log(new WordTable(header, body).string(), '\n');

module.exports = {};

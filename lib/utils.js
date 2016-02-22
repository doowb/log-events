'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('define-property', 'define');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('set-value', 'set');
require('union-value', 'union');
require('use');
require = fn;

/**
 * Cast `val` to an array
 *
 * @param  {String|Array} `val`
 * @return {Array}
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.isLast = function(arr, val) {
  return arr &&
    arr.length &&
    arr[arr.length - 1] === val;
};

utils.hasType = function(types, type) {
  return types.indexOf(type) !== -1;
};

utils.assertType = function(types, vals) {
  vals.forEach(function(val) {
    if (!utils.hasType(types, val)) {
      throw new Error('`type` must be one of [' + types.join(', ') + '] but got "' + val + '"');
    }
  });
};

utils.identity = function identity(val) {
  return val;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;

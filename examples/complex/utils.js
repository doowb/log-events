'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('ansi-bold', 'bold');
require('ansi-underline', 'underline');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('falsey');
require('get-value', 'get');
require('is-enabled');
require('set-value', 'set');
require('strip-color');
require('use');
require = fn;

/**
 * Regex for bold/underline
 */

var boldRegex = /(\x1B\[\d+m|[_\s]|^)([*]{1,2})(\S|\S[\w\W]+?\S)\2(?=[_\s,.!?]|(?:\x1B\[\d+m)|$)/g;
var underlineRegex = /(\x1B\[\d+m|[\s*]|^)(_{1,2})(\S|\S[\w\W]+?\S)\2(?=[*\s,.!?]|(?:\x1B\[\d+m)|$)/g;

// default keywords for falsey
var keywords = ['none', 'nil', 'nope', 'no', 'not', 'nada', '0', 'false'];

utils.toArray = function(args) {
  if (typeof args === 'string') {
    args = [args];
  } if (!Array.isArray(args) && typeof args.length !== 'undefined') {
    args = [].slice.call(args);
  } else {
    args = [].concat.apply([], [].slice.call(arguments));
  }
  return args;
};

/**
 * Cast `val` to an array
 *
 * @param  {String|Array} `val`
 * @return {Array}
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Ensure that `val` is a string.
 *
 * @param  {String} `val`
 * @return {String}
 */

utils.toString = function(val) {
  return val == null ? '' : val.toString();
};

/**
 * Display `*foo*` or `**foo**` as bold.
 *
 * @param  {String} `str`
 * @return {String}
 */

utils.toBold = function(str) {
  return utils.toString(str).replace(boldRegex, '$1' + utils.bold('$3'));
};

/**
 * Display `_foo_` as underlined.
 *
 * @param  {String} `str`
 * @return {String}
 */

utils.toUnderline = function(str) {
  return utils.toString(str).replace(underlineRegex, '$1' + utils.underline('$3'));
};

utils.markup = function(str) {
  str = utils.toString(str);
  return utils.toBold(utils.toUnderline(str));
};

utils.isFalsey = function(val, options) {
  var opts = utils.extend({keywords: keywords}, options);
  return utils.falsey(val, opts.keywords);
};

/**
 * Expose `utils` modules
 */

module.exports = utils;

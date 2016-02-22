'use strict';

var utils = require('./utils');

var identity = utils.identity;
var types = ['modifier', 'logger'];

function Modifier(options) {
  if (!(this instanceof Modifier)) {
    return new Modifier(options);
  }
  this.options = utils.extend({type: 'modifier'}, options);
  if (!this.name) {
    throw new Error('expected options.name to be set');
  }
  this.type = this.options.type;
}

/**
 * Type of `modifier`. Valid types are ['modifier', 'logger']
 *
 * ```js
 * console.log(red.type);
 * //=> "modifier"
 * console.log(error.type);
 * //=> "logger"
 * ```
 */

utils.define(Modifier.prototype, 'type', {
  enumerable: true,
  set: function(val) {
    val = utils.arrayify(val);
    utils.assertType(types, val);
    this.options.type = val;
  },
  get: function() {
    return this.options.type || 'modifier';
  }
});

/**
 * Readable name of `modifier`.
 *
 * ```js
 * console.log(red.name);
 * //=> "red"
 * console.log(error.name);
 * //=> "error"
 * ```
 */

utils.define(Modifier.prototype, 'name', {
  enumerable: true,
  set: function(val) {
    this.options.name = val;
  },
  get: function() {
    return this.options.name;
  }
});

/**
 * Optional modifier function that accepts a value and returns a modified value.
 * When not present, an identity function is used to return the original value.
 *
 * ```js
 * var msg = "some error message";
 *
 * // wrap message in ansi codes for "red"
 * msg = red.fn(msg);
 * console.log(msg);
 *
 * //=> "\u001b[31msome error message\u001b[39m";
 * ```
 */

utils.define(Modifier.prototype, 'fn', {
  set: function(fn) {
    this.options.fn = fn;
  },
  get: function() {
    return this.options.fn || identity;
  }
});

Modifier.prototype.inspect = function() {
  return this.name;
};


/**
 * Exposes `Modifier`
 */

module.exports = Modifier;

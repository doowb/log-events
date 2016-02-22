'use strict';

var utils = require('./utils');

var identity = utils.identity;
var types = ['mode', 'toggle'];

function Mode(options) {
  if (!(this instanceof Mode)) {
    return new Mode(options);
  }
  this.options = utils.extend({type: 'mode'}, options);
  if (!this.name) {
    throw new Error('expected options.name to be set');
  }
  this.type = this.options.type;
}

/**
 * Type of `mode`. Valid types are ['mode', 'toggle']
 *
 * ```js
 * console.log(verbose.type);
 * //=> "mode"
 * console.log(not.type);
 * //=> "toggle"
 * ```
 */

utils.define(Mode.prototype, 'type', {
  enumerable: true,
  set: function(val) {
    val = utils.arrayify(val);
    utils.assertType(types, val);
    this.options.type = val;
  },
  get: function() {
    return this.options.type || 'mode';
  }
});

/**
 * Readable name of `mode`.
 *
 * ```js
 * console.log(verbose.name);
 * //=> "verbose"
 * console.log(not.name);
 * //=> "not"
 * ```
 */

utils.define(Mode.prototype, 'name', {
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

utils.define(Mode.prototype, 'fn', {
  set: function(fn) {
    this.options.fn = fn;
  },
  get: function() {
    return this.options.fn || identity;
  }
});

Mode.prototype.inspect = function() {
  return this.name;
};

/**
 * Exposes `Mode`
 */

module.exports = Mode;

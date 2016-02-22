'use strict';

var utils = require('./utils');

var identity = utils.identity;
var types = ['mode', 'toggle'];

/**
 * Mode constructor for making a mode object when
 * a mode is created with `logger.mode()`
 *
 * @param {Object} `options` Options to configure the mode.
 * @param {String} `options.name` Required name of the mode
 * @param {String|Type} `options.type` Type of mode to create. Defaults to `mode`. Values may be `['mode', 'toggle']`.
 * @api public
 */

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
 *
 * @name type
 * @api public
 */

utils.define(Mode.prototype, 'type', {
  enumerable: true,
  set: function(val) {
    val = utils.arrayify(val);
    utils.assertType(types, val);
    this.options.type = val;
  },
  get: function() {
    return this.options.type;
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
 *
 * @name name
 * @api public
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
 *
 * @name `fn`
 * @api public
 */

utils.define(Mode.prototype, 'fn', {
  set: function(fn) {
    this.options.fn = fn;
  },
  get: function() {
    return this.options.fn || identity;
  }
});

/**
 * Custom inspect method for displaying the mode on the console.
 *
 * @return {String} mode.name
 */

Mode.prototype.inspect = function() {
  return this.name;
};

/**
 * Exposes `Mode`
 */

module.exports = Mode;

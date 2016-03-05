'use strict';

var utils = require('./utils');

var identity = utils.identity;

/**
 * Emitter constructor for making a emitter object when
 * a emitter is created with `logger.create()`
 *
 * @param {Object} `options` Options to configure the emitter.
 * @param {String} `options.name` Required name of the emitter
 * @param {Number} `options.level` Priority level of the emitter. Higher numbers are less severe. (Default: 100)
 * @api public
 */

function Emitter(options) {
  if (!(this instanceof Emitter)) {
    return new Emitter(options);
  }
  this.options = utils.extend({level: 100}, options);
  if (!this.name) {
    throw new Error('expected options.name to be set');
  }
  this.level = this.options.level;
}

/**
 * Level of the emitter.
 *
 * ```js
 * console.log(info.level);
 * //=> 5
 * console.log(error.level);
 * //=> 0
 * ```
 *
 * @name level
 * @api public
 */

utils.define(Emitter.prototype, 'level', {
  enumerable: true,
  set: function(val) {
    this.options.level = val;
  },
  get: function() {
    return this.options.level;
  }
});

/**
 * Readable name of `emitter`.
 *
 * ```js
 * console.log(info.name);
 * //=> "info"
 * console.log(error.name);
 * //=> "error"
 * ```
 *
 * @name name
 * @api public
 */

utils.define(Emitter.prototype, 'name', {
  enumerable: true,
  set: function(val) {
    this.options.name = val;
  },
  get: function() {
    return this.options.name;
  }
});

/**
 * Optional emitter function that accepts a value and returns a modified value.
 * When not present, an identity function is used to return the original value.
 *
 * ```js
 * var msg = "some error message";
 *
 * // wrap message in ansi codes for "red"
 * msg = error.fn(msg);
 * console.log(msg);
 *
 * //=> "\u001b[31msome error message\u001b[39m";
 * ```
 *
 * @name `fn`
 * @api public
 */

utils.define(Emitter.prototype, 'fn', {
  set: function(fn) {
    this.options.fn = fn;
  },
  get: function() {
    return this.options.fn || identity;
  }
});

/**
 * Custom inspect method for displaying the emitter on the console.
 *
 * @return {String} emitter.name
 */

Emitter.prototype.inspect = function() {
  return this.name;
};

/**
 * Exposes `Emitter`
 */

module.exports = Emitter;

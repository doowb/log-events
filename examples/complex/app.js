/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Logger = require('../../');
var utils = require('./utils');
var util = require('util');
var use = require('use');

/**
 * Expose `Verbalize`
 */

module.exports = Verbalize;

/**
 * Create an instance of `Verbalize` with the given `options`.
 *
 * ```js
 * var logger = new Verbalize({verbose: true});
 * ```
 * @param {Object} `options`
 * @api public
 */

function Verbalize(options) {
  if (!(this instanceof Verbalize)) {
    return new Verbalize(options);
  }
  Logger.call(this);
  this.options = options || {};
  this.define('cache', {});
  use(this);
}

/**
 * Mixin `Logger` prototype methods
 */

util.inherits(Verbalize, Logger);

/**
 * Base formatting.
 *
 * @return {String} `msg`
 * @api public
 */

Verbalize.prototype._format = function(args) {
  args = utils.toArray.apply(null, arguments);

  if (args.length > 0) {
    args[0] = String(args[0]);
  }
  return util.format.apply(util, args);
};

/**
 * Write to the console.
 *
 * @return {String} `msg`
 * @api public
 */

Verbalize.prototype._write = function(msg) {
  process.stdout.write(utils.markup(msg || ''));
  return this;
};

/**
 * Write to the console followed by a newline. A blank
 * line is returned if no value is passed.
 *
 * @return {String} `msg`
 * @api public
 */

Verbalize.prototype._writeln = function(msg) {
  return this._write((msg || '') + '\n');
};

/**
 * Write output.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.write = function() {
  return this._write(this._format(arguments));
};

/**
 * Write output followed by a newline.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.writeln = function() {
  return this._writeln(this._format(arguments));
};

/**
 * Style a basic separator.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.sep = function(str) {
  return this._sep || (this._sep = this.stylize('gray', str || ' · '));
};

Verbalize.prototype.style = function(name, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  var opts = utils.extend({type: ['modifier'], fn: fn}, options);
  return this.create(name, opts);
};

/**
 * Stylize the given `msg` with the specified `color`.
 *
 * @param {String} `color` The name of the color to use
 * @param {String} `msg` The args to stylize.
 * @return {String}
 */

Verbalize.prototype.stylize = function(color, args) {
  args = utils.toArray(args);
  var len = args.length;
  var res = [];
  var idx = -1;

  var strip = this.options.stripColor === true;
  while (++idx < len) {
    var arg = args[idx];
    if (strip) {
      res.push(utils.stripColor(arg));
    } else {
      var modifier = null;
      if (typeof color === 'string') {
        modifier = utils.get(this.modifiers, [color]);
      } else {
        modifier = color;
      }
      if (modifier) {
        res.push(modifier.fn.call(this, arg));
      } else {
        res.push(arg);
      }
    }
  }
  return res;
};

/**
 * Define non-enumerable property `key` with the given value.
 *
 * @param {String} `key`
 * @param {any} `value`
 * @return {String}
 * @api public
 */

Verbalize.prototype.define = function(key, value) {
  utils.define(this, key, value);
  return this;
};

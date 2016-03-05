/*!
 * log-events <https://github.com/doowb/log-events>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var ComponentEmitter = require('component-emitter');
var utils = require('./lib/utils');
var Mode = require('./lib/mode');
var Emitter = require('./lib/emitter');
var Stack = require('./lib/stack');

function create() {

  /**
   * Create a new `Logger` constructor to allow
   * updating the prototype without affecting other contructors.
   *
   * @api public
   */

  function Logger() {
    if (!(this instanceof Logger)) {
      return new Logger();
    }

    utils.define(this, 'emitterKeys', []);
    utils.define(this, 'emitters', {});
    utils.define(this, 'methods', {});
    utils.define(this, 'modeKeys', []);
    utils.define(this, 'modes', {});
    utils.define(this, 'styleKeys', []);
    utils.define(this, 'styles', {});
    utils.define(this, 'stack', new Stack());

    // default emitter "log"
    this.emitter('log');
  }

  /**
   * Mixin `ComponentEmitter` prototype methods
   */

  ComponentEmitter(Logger.prototype);

  /**
   * Factory for emitting log messages.
   * This method is called internally for any emitter or mode method that is
   * called as a function. To listen for events, listen for the emitter name or
   * `'log'` when a mode is called as a method.
   *
   * Wildcard `*` may also be listened for and will get 2 arguments `(name, stats)` where
   * `name` is the emitter that was emitted and `stats` is the stats object for that event.
   *
   * ```js
   * // emit `info` when `info` is an emitter method
   * logger.info('message');
   *
   * // emit `log` when `verbose` is a mode method
   * logger.verbose('message');
   *
   * // listen for all events
   * logger.on('*', function(name, stats) {
   *   console.log(name);
   *   //=> info
   * });
   *
   * logger.info('message');
   * ```
   *
   * @param  {String} `name` the name of the emitter event to emit. Example: `info`
   * @param  {String} `message` Message intended to be emitted.
   * @emits  {String, Object} `*` Wildcard emitter that emits the emitter event name and stats object.
   * @emits  {Object} `stats` Emitter that emits the stats object for the specified name.
   * @return {Object} `Logger` for chaining
   * @api public
   */

  Logger.prototype._emit = function(name/*, message*/) {
    var args = [].slice.call(arguments, 1);
    var emitter = this.emitters[name];
    if (!emitter) {
      throw new Error('Unable to find emitter "' + name + '"');
    }
    this.stack.process(function(stats) {
      stats.args = args;
      this.emit.call(this, '*', stats.name, stats);
      this.emit.call(this, stats.name, stats);
    }, this);
    return this;
  };

  /**
   * Add an emitter method to emit an event with the given `name`.
   *
   * ```js
   * // add a default `write` emitter
   * logger.emitter('write');
   *
   * // add some styles
   * logger.style('red', function(msg) {
   *   return colors.red(msg);
   * });
   * logger.style('cyan', function(msg) {
   *   return colors.cyan(msg);
   * });
   *
   * // add an `info` logger that colors the msg cyan
   * logger.emitter('info', logger.cyan);
   *
   * // use the loggers:
   * logger.red.write('this is a red message');
   * logger.info('this is a cyan message');
   * ```
   *
   * @param  {String} `name` the name of the emitter event to emit.
   * @param  {Number} `level` Priority level of the emitter. Higher numbers are less severe. (Default: 100)
   * @param  {Function} `fn` Optional emitter function that can be used to modify an emitted message. Function may be an existing style function.
   * @emits  {String} `emitter` Emits name and new emitter instance after adding the emitter method.
   * @return {Object} `this` for chaining
   * @api public
   */

  Logger.prototype.emitter = function(name, level, fn) {
    this.methods[name] = null;
    Object.defineProperty(Logger.prototype, name, {
      configurable: true,
      enumerable: true,
      get: buildEmitter.call(this, name, level, fn),
      set: function(fn) {
        this.methods[name] = fn;
        return fn;
      }
    });
    this.emit('emitter', name);
    return this;
  };

  /**
   * Add arbitrary modes to be used for creating namespaces for emitter methods.
   *
   * ```js
   * // create a simple `verbose` mode
   * logger.mode('verbose');
   *
   * // create a `not` toggle mode
   * logger.mode('not', {type: 'toggle'});
   *
   * // create a `debug` mode that modifies the message
   * logger.mode('debug', function(msg) {
   *   return '[DEBUG]: ' + msg;
   * });
   *
   * // use the modes with styles and emitters from above:
   * logger.verbose.red.write('write a red message when verbose is true');
   * logger.not.verbose.info('write a cyan message when verbose is false');
   * logger.debug('write a message when debug is true');
   * ```
   *
   * @param  {String} `mode` Mode to add to the logger.
   * @param  {Object} `options` Options to describe the mode.
   * @param  {String|Array} `options.type` Type of mode being created. Defaults to `mode`. Valid values are `['mode', 'toggle']`
   *                                      `toggle` mode may be used to indicate a "flipped" state for another mode.
   *                                      e.g. `not.verbose`
   *                                      `toggle` modes may not be used directly for emitting log events.
   * @param  {Function} `fn` Optional style function that can be used to stylize an emitted message.
   * @emits  {String} `mode` Emits the name and new mode instance after adding the mode method.
   * @return {Object} `this` for chaining
   * @api public
   */

  Logger.prototype.mode = function(mode, options, fn) {
    Object.defineProperty(Logger.prototype, mode, {
      configurable: true,
      enumerable: true,
      get: buildMode.call(this, mode, options, fn)
    });
    this.emit('mode', mode);
    return this;
  };

  Logger.prototype.style = function(style, fn) {
    Object.defineProperty(Logger.prototype, style, {
      configurable: true,
      enumerable: true,
      get: buildStyle.call(this, style, fn)
    });
    this.emit('style', style);
    return this;
  };

  /**
   * Create an emitter getter function that can be used in chaining
   *
   * @param  {String} `name` the name of the emitter event to emit
   * @return {Function} getter function to be used in `defineProperty`
   */

  function buildEmitter(name, level, fn) {
    if (typeof level === 'function') {
      fn = level;
      level = 100;
    }
    if (this.emitterKeys.indexOf(name) === -1) {
      this.emitterKeys.push(name);
    }

    return function() {
      var emitter = this.emitters[name];
      if (typeof emitter === 'undefined') {
        emitter = new Emitter({name: name, level: level, fn: fn});
        this.emitters[name] = emitter;
      }
      this.stack.chainEmitter(emitter);

      var method;
      if (typeof this.methods[name] === 'function') {
        method = this.methods[name];
      } else {
        method = function(/*message*/) {
          var args = [].slice.call(arguments);
          args.unshift(name);
          return this._emit.apply(this, args);
        }.bind(this);
        this.methods[name] = method;
      }
      method.__proto__ = Logger.prototype;
      return method;
    }.bind(this);
  }

  /**
   * Create an instance of a mode object that switches
   * the current `mode` of the logger.
   *
   * @param  {String} `mode` mode to set when getting this proeprty.
   * @return {Function} getter function to be used in `defineProperty`
   */

  function buildMode(name, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    if (this.modeKeys.indexOf(name) === -1) {
      this.modeKeys.push(name);
    }

    return function() {
      var mode = this.modes[name];
      if (typeof mode === 'undefined') {
        var opts = utils.extend({name: name, type: 'mode', fn: fn}, options);
        mode = new Mode(opts);
        this.modes[name] = mode;
      }

      this.stack.addMode(mode);
      if (utils.hasType(mode.type, 'toggle')) {
        var ModeWrapper = function() {};
        var inst = new ModeWrapper();
        inst.__proto__ = Logger.prototype;
        return inst;
      }

      var method;
      if (typeof this.methods[name] === 'function') {
        method = this.methods[name];
      } else {
        method = function(/*message*/) {
          return this.log(...arguments);
        }.bind(this);
        this.methods[name] = method;
      }
      method.__proto__ = Logger.prototype;
      return method;
    }.bind(this);
  }

  /**
   * Create a style getter function that can be used in chaining
   *
   * @param  {String} `name` the name of the style
   * @param {Function} `fn` style function to apply to the arguments when called
   * @return {Function} getter function to be used in `defineProperty`
   */

  function buildStyle(name, fn) {
    if (this.styleKeys.indexOf(name) === -1) {
      this.styleKeys.push(name);
    }

    return function() {
      var self = this;
      var style;
      this.stack.addStyle(name);
      if (typeof this.styles[name] === 'function') {
        style = this.styles[name];
      } else {
        style = function(/*message*/) {
          var args = [].slice.call(arguments);
          self.stack.removeStyle(name);
          return fn.apply(self, args);
        };
        this.styles[name] = style;
      }
      style.__proto__ = Logger.prototype;
      return style;
    }.bind(this);
  }

  return Logger;
}

/**
 * Expose `logger-events`
 */

module.exports = create();

/**
 * Allow users to create a new Constructor
 */

module.exports.create = create;

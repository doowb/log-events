'use strict';

var utils = require('./utils');

/**
 * Stats contructor that contains information
 * about a chained event being built up.
 *
 * ```js
 * {
 *   // "not" => toggle, "verbose" => mode
 *   modes: ['not', 'verbose'],
 *
 *   // "red" => modifier, "subhead" => logger
 *   modifiers: ['red', 'subhead'],
 *
 *   // specified when logger is created
 *   level: 1,
 *
 *   // name of logger that will trigger an event
 *   // in this case "red" will not trigger an event
 *   name: 'subhead',
 *
 *   // arguments passed into logger function "subhead"
 *   args: ['foo', 'bar', 'baz']
 * }
 * ```
 *
 */

function Stats(parent) {
  if (!(this instanceof Stats)) {
    return new Stats(parent);
  }
  this.initStats(parent);
}

Stats.prototype.initStats = function(parent) {
  if (parent) {
    this.initModes(parent);
    this.initModifiers(parent);
  } else {
    this.modes = utils.arrayify(this.modes);
    this.modifiers = utils.arrayify(this.modifiers);
  }
};

Stats.prototype.initModes = function(parent) {
  this.modes = parent.modes;
};

Stats.prototype.initModifiers = function(parent) {
  this.modifiers = parent.modifiers.filter(function(modifier) {
    if (typeof modifier !== 'object') {
      return false;
    }
    return !utils.hasType(modifier.type, 'logger');
  });
};

Stats.prototype.union = function(prop, val) {
  utils.union(this, prop, val);
  return this;
};

Stats.prototype.addMode = function(mode) {
  return this.union('modes', mode);
};

Stats.prototype.addModifier = function(mod) {
  return this.union('modifiers', mod);
};

Stats.prototype.addLogger = function(logger) {
  this.name = logger.name;
  return this.union('modifiers', logger);
};

Stats.prototype.inspect = function() {
  return '<Stats [' + this.name + '] [' + this.modes.map(inspect) + '] [' + this.modifiers.map(inspect) + ']>';
};

function inspect(val) {
  if (typeof val === 'object') {
    return val.inspect();
  }
  return val;
}

/**
 * Exposes `Stats`
 */

module.exports = Stats;

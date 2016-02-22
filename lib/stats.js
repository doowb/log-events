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
 * @param {Object} `parent` Optional stats instance to inherit `modes` and `modifiers` from.
 * @api public
 */

function Stats(parent) {
  if (!(this instanceof Stats)) {
    return new Stats(parent);
  }
  this.initStats(parent);
}

/**
 * Initialize the stats object with modes and modifiers from the parent.
 *
 * @param  {Object} `parent` Optional parent object to inherit stats from.
 * @return {Object} `this` for chaining.
 */

Stats.prototype.initStats = function(parent) {
  if (parent) {
    this.initModes(parent);
    this.initModifiers(parent);
  } else {
    this.modes = utils.arrayify(this.modes);
    this.modifiers = utils.arrayify(this.modifiers);
  }
  return this;
};

/**
 * Inherit modes from the parent.
 *
 * @param  {Object} `parent` Parent stats object to inherit modes from.
 * @return {Object} `this` for chaining.
 */

Stats.prototype.initModes = function(parent) {
  this.modes = parent.modes;
  return this;
};

/**
 * Inherit modifiers from the parent.
 * Only modifiers that do not have the `logger` type will be inherited.
 *
 * @param  {Object} `parent` Parent stats object to inherit modifiers from.
 * @return {Object} `this` for chaining.
 */

Stats.prototype.initModifiers = function(parent) {
  this.modifiers = parent.modifiers.filter(function(modifier) {
    return !utils.hasType(modifier.type, 'logger');
  });
  return this;
};

/**
 * Helper method to union a value onto an array property.
 * See `addMode` and `addModifier`.
 *
 * @param  {String} `prop` Name of property to union to.
 * @param  {*} `val` Value to union on the property.
 * @return {Object} `this` for chaining.
 */

Stats.prototype.union = function(prop, val) {
  utils.union(this, prop, val);
  return this;
};

/**
 * Add a mode to the `modes` array for this stats object.
 *
 * ```js
 * var verbose = new Mode({name: 'verbose'});
 * stats.addMode(verbose);
 * ```
 *
 * @param {Object} `mode` Instance of a Mode to add to the stats object.
 * @return {Object} `this` for chaining.
 * @api public
 */

Stats.prototype.addMode = function(mode) {
  return this.union('modes', mode);
};

/**
 * Get the array of modes from the stats object.
 * Optionally, pass a property in and return an array with
 * only the property.
 *
 * ```js
 * var modes = stats.getModes();
 * //=> [{name: 'verbose'}]
 * var modeNames = stats.getModes('name');
 * //=> ['verbose']
 * ```
 *
 * @param  {String} `prop` Optional property to pick from the mode objects to return.
 * @return {Array} Array of modes or mode properties.
 * @api public
 */

Stats.prototype.getModes = function(prop) {
  if (!prop) return this.modes;
  return this.modes.map(function(mode) {
    return mode[prop];
  });
};

/**
 * Add a modifier to the `modifiers` array for this stats object.
 *
 * ```js
 * var info = new Modifier({name: 'info'});
 * stats.addModifier(info);
 * ```
 *
 * @param {Object} `modifier` Instance of a Modifier to add to the stats object.
 * @return {Object} `this` for chaining.
 * @api public
 */

Stats.prototype.addModifier = function(mod) {
  return this.union('modifiers', mod);
};

/**
 * Get the array of modifiers from the stats object.
 * Optionally, pass a property in and return an array with
 * only the property.
 *
 * ```js
 * var modifiers = stats.getModifiers();
 * //=> [{name: 'verbose'}]
 * var modifierNames = stats.getModifiers('name');
 * //=> ['verbose']
 * ```
 *
 * @param  {String} `prop` Optional property to pick from the modifier objects to return.
 * @return {Array} Array of modifiers or modifier properties.
 * @api public
 */

Stats.prototype.getModifiers = function(prop) {
  if (!prop) return this.modifiers;
  return this.modifiers.map(function(modifier) {
    return modifier[prop];
  });
};

/**
 * Add a modifier to the `modifiers` array for this stats object.
 * Same as `addModifier` but also sets the `.name` property on the
 * stats object to indicate this is a complete stats object ready
 * to be emitted.
 *
 * ```js
 * var info = new Modifier({name: 'info'});
 * stats.addLogger(info);
 * ```
 *
 * @param {Object} `modifier` Instance of a Modifier to add to the stats object.
 * @return {Object} `this` for chaining.
 * @api public
 */

Stats.prototype.addLogger = function(logger) {
  this.name = logger.name;
  return this.union('modifiers', logger);
};

/**
 * Exposes `Stats`
 */

module.exports = Stats;

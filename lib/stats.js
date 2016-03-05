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
 *   // "red" => modifier
 *   styles: ['red'],
 *
 *   // specified when emitter is created
 *   level: 1,
 *
 *   // name of emitter that will trigger an event
 *   // in this case "red" will not trigger an event
 *   name: 'subhead',
 *
 *   // arguments passed into emitter function "subhead"
 *   args: ['foo', 'bar', 'baz']
 * }
 * ```
 *
 * @param {Object} `parent` Optional stats instance to inherit `modes` and `styles` from.
 * @api public
 */

function Stats(parent) {
  if (!(this instanceof Stats)) {
    return new Stats(parent);
  }
  this.initStats(parent);
}

/**
 * Initialize the stats object with modes and styles from the parent.
 *
 * @param  {Object} `parent` Optional parent object to inherit stats from.
 * @return {Object} `this` for chaining.
 */

Stats.prototype.initStats = function(parent) {
  this.modes = utils.arrayify(parent ? parent.modes : this.modes);
  this.styles = utils.arrayify(parent ? parent.styles : this.styles);
  return this;
};

/**
 * Helper method to union a value onto an array property.
 * See `addMode` and `addStyle`.
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
 * Add a style to the `styles` array for this stats object.
 *
 * ```js
 * stats.addStyle('red');
 * ```
 *
 * @param {String} `style` Name of style to add.
 * @return {Object} `this` for chaining.
 * @api public
 */

Stats.prototype.addStyle = function(style) {
  return this.union('styles', style);
};

/**
 * Sets the emitter for this stats object to indicate this is a complete stats object ready to be emitted.
 *
 * ```js
 * var info = new Emitter({name: 'info'});
 * stats.addEmitter(info);
 * ```
 *
 * @param {Object} `emitter` Instance of a Emitter to add to the stats object.
 * @return {Object} `this` for chaining.
 * @api public
 */

Stats.prototype.addEmitter = function(emitter) {
  this.name = emitter.name;
  this.emitter = emitter;
  return this;
};

/**
 * Exposes `Stats`
 */

module.exports = Stats;

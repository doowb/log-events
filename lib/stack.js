'use strict';

var utils = require('./utils');
var Stats = require('./stats');

/**
 * Stack contructor that manages logger stats
 * being built up through method chaining.
 */

function Stack() {
  if (!(this instanceof Stack)) {
    return new Stack();
  }

  utils.define(this, 'items', []);
  utils.define(this, 'current', null);
  this.createStats();
}

/**
 * Creates a new stats object and pushes it onto the items array.
 * Optionally pass in a parent to inherit modes and modifiers.
 *
 * @param  {Object} `parent` Optional parent to inherit modes and modifiers from.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.createStats = function(parent) {
  var stats = new Stats(parent);
  this.current = stats;
  this.items.push(stats);
  return this;
};

/**
 * Add a mode to the stack. Creates a new stats
 * object if the current one already has a name,
 * indicating that it will be emitted.
 *
 * @param {Object} `mode` Mode instance to add
 * @return {Object} `this` for chaining.
 */

Stack.prototype.addMode = function(mode) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addMode(mode);
  return this;
};

/**
 * Add a modifier to the stack. Creates a new stats
 * object if the current one already has a name,
 * indicating that it will be emitted.
 *
 * @param {Object} `modifier` Modifier instance to add.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.addModifier = function(modifier) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addModifier(modifier);
  return this;
};

/**
 * Same as `addModifier` but passes the current
 * stats object to `createStats` when the current stats
 * object has a name assigned. This is used for inheriting
 * modes and modifiers during logger chaining.
 *
 * @param {Object} `logger` Modifier instance to add as the emitted logger.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.addLogger = function(logger) {
  if (this.current.name) {
    this.createStats(this.current);
  }
  this.current.addLogger(logger);
  return this;
};

/**
 * Sets the name on the current stats object as the given
 * logger name. If the logger has not already been added to the
 * stats modifier area, it's added.
 * This indicates that this logger will be emitted when chaining
 * is complete and new calls to loggers should be inherited from this one.
 *
 * @param {Object} `logger` Modifier instance to use for setting name.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.setName = function(logger) {
  if (!utils.isLast(this.current.getModifiers('name'), logger.name)) {
    this.current.addLogger(logger);
  } else {
    this.current.name = logger.name;
  }
  return this;
};

/**
 * Iterate over the items in the stack and call
 * the given `fn` function for each method.
 * The items array is cleared before iteration to allow
 * for other log events to fire while iterating.
 *
 * ```js
 * stack.addMode(new Mode({name: 'verbose'}));
 * stack.addLogger(new Modifier({name: 'info'}));
 * stack.process(function(stats) {
 *   console.log(stats);
 *   //=> {
 *   //=>   modes: ['verbose'],
 *   //=>   modifiers: ['info'],
 *   //=>   name: 'info'
 *   //=> }
 * });
 * ```
 *
 * @param  {Function} `fn` Iterator function to call for each stats object on the items array.
 * @param  {Object} `thisArg` `this` argument used for the context in the `forEach` loop.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.process = function(fn, thisArg) {
  var items = this.items;
  this.items = [];
  items.forEach(fn, thisArg);
  return this;
};

/**
 * Exposes `Stack`
 */

module.exports = Stack;

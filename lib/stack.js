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
 * Add a style to the stack. Creates a new stats
 * object if the current one already has a name,
 * indicating that it will be emitted.
 *
 * @param {Object} `style` Style name to add.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.addStyle = function(style) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addStyle(style);
  return this;
};

Stack.prototype.removeStyle = function(style) {
  var idx = this.current.styles.indexOf(style);
  if (idx === -1) return this;
  this.current.styles.splice(idx, 1);
  return this;
};

/**
 * Add an emitter to the stack. Creates a new stats
 * object if the current one already has a name,
 * indicating that it will be emitted.
 *
 * @param {Object} `emitter` Emitter instance to add.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.addEmitter = function(emitter) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addEmitter(emitter);
  return this;
};

/**
 * Add an emitter to the stack. Creates a new stats
 * object if the current one already has a name,
 * indicating that it will be emitted.
 *
 * @param {Object} `emitter` Emitter instance to add.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.addEmitter = function(emitter) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addEmitter(emitter);
  return this;
};

/**
 * Same as `addEmitter` but passes the current
 * stats object to `createStats` when the current stats
 * object has a name assigned. This is used for inheriting
 * modes and styles during emitter chaining.
 *
 * @param {Object} `emitter` Emitter instance to add as the emitted event.
 * @return {Object} `this` for chaining.
 */

Stack.prototype.chainEmitter = function(emitter) {
  if (this.current.name) {
    this.createStats(this.current);
  }
  this.current.addEmitter(emitter);
  return this;
};

/**
 * Iterate over the items in the stack and call
 * the given `fn` function for each method.
 * The items array is cleared before iteration to allow
 * for other events to fire while iterating.
 *
 * ```js
 * stack.addMode(new Mode({name: 'verbose'}));
 * stack.addEmitter(new Emitter({name: 'info'}));
 * stack.process(function(stats) {
 *   console.log(stats);
 *   //=> {
 *   //=>   modes: ['verbose'],
 *   //=>   emitters: ['info'],
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
  this.createStats();
  items.forEach(fn, thisArg);
  return this;
};

/**
 * Exposes `Stack`
 */

module.exports = Stack;

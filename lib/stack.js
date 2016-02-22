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

Stack.prototype.createStats = function(parent) {
  var stats = new Stats(parent);
  this.current = stats;
  this.items.push(stats);
  return this;
};

Stack.prototype.addMode = function(mode) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addMode(mode);
  return this;
};

Stack.prototype.addModifier = function(mod) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addModifier(mod);
  return this;
};

Stack.prototype.addLogger = function(logger) {
  if (this.current.name) {
    this.createStats(this.current);
  }
  this.current.addLogger(logger);
  return this;
};

Stack.prototype.setName = function(logger) {
  if (!isLast(this.current.modifiers, logger.name)) {
    this.current.addLogger(logger);
  } else {
    this.current.name = logger.name;
  }
  return this;
};

Stack.prototype.process = function(fn, thisArg) {
  var items = this.items;
  this.items = [];
  items.forEach(fn, thisArg);
  return this;
};

function isLast(modifiers, name) {
  var arr = modifiers.map(function(modifier) {
    return modifier.name;
  });
  return utils.isLast(arr, name);
}

/**
 * Exposes `Stack`
 */

module.exports = Stack;

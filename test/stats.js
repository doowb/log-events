/*!
 * log-events <https://github.com/doowb/log-events>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var utils = require('../lib/utils');
var Mode = require('../lib/mode');
var Modifier = require('../lib/modifier');
var Stats = require('../lib/stats');

describe('stats', function() {
  it('should create a new instance', function() {
    var stats = new Stats();
    assert(stats);
    assert.equal(stats instanceof Stats, true);
    assert.equal(typeof stats.name, 'undefined');
    assert.equal(Array.isArray(stats.modes), true);
    assert.equal(Array.isArray(stats.modifiers), true);
  });

  it('should create a new instance without `new` keyword', function() {
    var stats = Stats();
    assert(stats);
    assert.equal(stats instanceof Stats, true);
    assert.equal(typeof stats.name, 'undefined');
    assert.equal(Array.isArray(stats.modes), true);
    assert.equal(Array.isArray(stats.modifiers), true);
  });

  it('should add a mode to the modes array', function() {
    var stats = new Stats();
    assert.deepEqual(stats.modes, []);
    var mode = new Mode({name: 'verbose'});
    stats.addMode(mode);
    assert.deepEqual(stats.modes, [mode]);
  });

  it('should get array of modes', function() {
    var stats = new Stats();
    assert.deepEqual(stats.getModes(), []);
    var mode = new Mode({name: 'verbose'});
    stats.addMode(mode);
    assert.deepEqual(stats.getModes(), [mode]);
  });

  it('should get array of mode names', function() {
    var stats = new Stats();
    assert.deepEqual(stats.getModes('name'), []);
    var mode = new Mode({name: 'verbose'});
    stats.addMode(mode);
    assert.deepEqual(stats.getModes('name'), ['verbose']);
  });

  it('should add a modifier to the modifiers array', function() {
    var stats = new Stats();
    assert.deepEqual(stats.modifiers, []);
    var modifier = new Modifier({name: 'red'});
    stats.addModifier(modifier);
    assert.deepEqual(stats.modifiers, [modifier]);
  });

  it('should get array of modifiers', function() {
    var stats = new Stats();
    assert.deepEqual(stats.getModifiers(), []);
    var modifier = new Modifier({name: 'red'});
    stats.addModifier(modifier);
    assert.deepEqual(stats.getModifiers(), [modifier]);
  });

  it('should get array of modifier names', function() {
    var stats = new Stats();
    assert.deepEqual(stats.getModifiers('name'), []);
    var modifier = new Modifier({name: 'red'});
    stats.addModifier(modifier);
    assert.deepEqual(stats.getModifiers('name'), ['red']);
  });

  it('should create a new instance with modes and modifiers from a parent stats object', function() {
    var parent = Stats();
    parent.addMode(new Mode({name: 'verbose'}));
    parent.addModifier(new Modifier({name: 'red'}));
    parent.addModifier(new Modifier({name: 'error', type: 'logger'}))
    assert.deepEqual(parent.getModes('name'), ['verbose']);
    assert.deepEqual(parent.getModifiers('name'), ['red', 'error']);

    var stats = Stats(parent);
    assert(stats);
    assert.equal(stats instanceof Stats, true);
    assert.equal(typeof stats.name, 'undefined');
    assert.equal(Array.isArray(stats.modes), true);
    assert.equal(Array.isArray(stats.modifiers), true);
    assert.deepEqual(stats.getModes('name'), ['verbose']);
    assert.deepEqual(stats.getModifiers('name'), ['red']);
  });

  it('should set the name when addLogger is called', function() {
    var stats = new Stats();
    assert.equal(typeof stats.name, 'undefined');
    stats.addLogger(new Modifier({name: 'error', type: 'logger'}));
    assert.equal(stats.name, 'error');
    assert.deepEqual(stats.getModifiers('name'), ['error']);
  });
});

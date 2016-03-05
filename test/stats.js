/*!
 * log-events <https://github.com/doowb/log-events>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var Mode = require('../lib/mode');
var Emitter = require('../lib/emitter');
var Stats = require('../lib/stats');

describe('stats', function() {
  it('should create a new instance', function() {
    var stats = new Stats();
    assert(stats);
    assert.equal(stats instanceof Stats, true);
    assert.equal(typeof stats.name, 'undefined');
    assert.equal(Array.isArray(stats.modes), true);
    assert.equal(Array.isArray(stats.styles), true);
  });

  it('should create a new instance without `new` keyword', function() {
    var stats = Stats();
    assert(stats);
    assert.equal(stats instanceof Stats, true);
    assert.equal(typeof stats.name, 'undefined');
    assert.equal(Array.isArray(stats.modes), true);
    assert.equal(Array.isArray(stats.styles), true);
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

  it('should add a style to the styles array', function() {
    var stats = new Stats();
    assert.deepEqual(stats.styles, []);
    stats.addStyle('red');
    assert.deepEqual(stats.styles, ['red']);
  });

  it('should create a new instance with modes and styles from a parent stats object', function() {
    var parent = Stats();
    parent.addMode(new Mode({name: 'verbose'}));
    parent.addStyle('red');
    parent.addEmitter(new Emitter({name: 'error', level: 1}));
    assert.equal(parent.name, 'error');
    assert.deepEqual(parent.getModes('name'), ['verbose']);
    assert.deepEqual(parent.styles, ['red']);

    var stats = Stats(parent);
    assert(stats);
    assert.equal(stats instanceof Stats, true);
    assert.equal(typeof stats.name, 'undefined');
    assert.equal(Array.isArray(stats.modes), true);
    assert.equal(Array.isArray(stats.styles), true);
    assert.deepEqual(stats.getModes('name'), ['verbose']);
    assert.deepEqual(stats.styles, ['red']);
  });

  it('should set the name when addEmitter is called', function() {
    var stats = new Stats();
    assert.equal(typeof stats.name, 'undefined');
    stats.addEmitter(new Emitter({name: 'error', level: 0}));
    assert.equal(stats.name, 'error');
  });
});

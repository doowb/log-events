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
var Stack = require('../lib/stack');
var Stats = require('../lib/stats');

describe('stack', function() {
  it('should create a new instance', function() {
    var stack = new Stack();
    assert(stack);
    assert.equal(stack instanceof Stack, true);
    assert.equal(Array.isArray(stack.items), true);
    assert.equal(typeof stack.current, 'object');
    assert.equal(stack.current instanceof Stats, true);
  });

  it('should create a new instance without `new` keyword', function() {
    var stack = Stack();
    assert(stack);
    assert.equal(stack instanceof Stack, true);
    assert.equal(Array.isArray(stack.items), true);
    assert.equal(typeof stack.current, 'object');
    assert.equal(stack.current instanceof Stats, true);
  });

  it('should add a mode to the current modes array', function() {
    var stack = new Stack();
    assert.deepEqual(stack.current.modes, []);
    var mode = new Mode({name: 'verbose'});
    stack.addMode(mode);
    assert.deepEqual(stack.current.modes, [mode]);
  });

  it('should get array of current modes', function() {
    var stack = new Stack();
    assert.deepEqual(stack.current.getModes(), []);
    var mode = new Mode({name: 'verbose'});
    stack.addMode(mode);
    assert.deepEqual(stack.current.getModes(), [mode]);
  });

  it('should get array of current mode names', function() {
    var stack = new Stack();
    assert.deepEqual(stack.current.getModes('name'), []);
    var mode = new Mode({name: 'verbose'});
    stack.addMode(mode);
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
  });

  it('should add a style to the current styles array', function() {
    var stack = new Stack();
    assert.deepEqual(stack.current.styles, []);
    stack.addStyle('red');
    assert.deepEqual(stack.current.styles, ['red']);
  });

  it('should create a new Stats object when current.name is already set', function() {
    var stack = new Stack();
    stack.addMode(new Mode({name: 'verbose'}));
    stack.addStyle('red');
    var error = new Emitter({name: 'error', level: 0});
    stack.addEmitter(error);
    assert.equal(stack.current.name, 'error');
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.styles, ['red']);

    stack.addEmitter(new Emitter({name: 'warn', level: 1}));
    assert.equal(stack.current.name, 'warn');
    assert.deepEqual(stack.current.getModes('name'), []);
    assert.deepEqual(stack.current.styles, []);
  });

  it('should create new Stats object using current Stats information as parent', function() {
    // simulates doing `logger.verbose.red.error.warn('foo')`
    var stack = Stack();
    stack.addMode(new Mode({name: 'verbose'}));
    stack.addStyle('red');
    stack.chainEmitter(new Emitter({name: 'error', level: 0}));

    assert.equal(stack.current.name, 'error');
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.styles, ['red']);

    var parent = stack.current;
    stack.chainEmitter(new Emitter({name: 'warn', level: 1}));

    assert.equal(parent.name, 'error');
    assert.deepEqual(parent.getModes('name'), ['verbose']);
    assert.deepEqual(parent.styles, ['red']);

    assert.equal(stack.current.name, 'warn');
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.styles, ['red']);
  });

  it('should set the current logger name', function() {
    var stack = new Stack();
    assert.equal(typeof stack.current.name, 'undefined');
    var error = new Emitter({name: 'error'});
    stack.addEmitter(error);
    assert.equal(stack.current.name, 'error');
  });

  it('should call the given function for each item in the stack', function() {
    // simulates doing `logger.verbose.red.error.warn('foo')`
    var stack = Stack();
    stack.addMode(new Mode({name: 'verbose'}));
    stack.addStyle('red');
    stack.chainEmitter(new Emitter({name: 'error', level: 0}));

    assert.equal(stack.current.name, 'error');
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.styles, ['red']);

    var parent = stack.current;
    stack.chainEmitter(new Emitter({name: 'warn', level: 1}));

    assert.equal(parent.name, 'error');
    assert.deepEqual(parent.getModes('name'), ['verbose']);
    assert.deepEqual(parent.styles, ['red']);
    assert.equal(stack.current.name, 'warn');
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.styles, ['red']);

    var items = stack.items;
    stack.process(function(stats, i) {
      assert.deepEqual(stats, items[i]);
    });
  });
});

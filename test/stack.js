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
var Modifier = require('../lib/modifier');
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

  it('should add a modifier to the current modifiers array', function() {
    var stack = new Stack();
    assert.deepEqual(stack.current.modifiers, []);
    var modifier = new Modifier({name: 'red'});
    stack.addModifier(modifier);
    assert.deepEqual(stack.current.modifiers, [modifier]);
  });

  it('should get array of current modifiers', function() {
    var stack = new Stack();
    assert.deepEqual(stack.current.getModifiers(), []);
    var modifier = new Modifier({name: 'red'});
    stack.addModifier(modifier);
    assert.deepEqual(stack.current.getModifiers(), [modifier]);
  });

  it('should get array of current modifier names', function() {
    var stack = new Stack();
    assert.deepEqual(stack.current.getModifiers('name'), []);
    var modifier = new Modifier({name: 'red'});
    stack.addModifier(modifier);
    assert.deepEqual(stack.current.getModifiers('name'), ['red']);
  });

  it('should create a new Stats object when current.name is already set', function() {
    var stack = new Stack();
    stack.addMode(new Mode({name: 'verbose'}));
    stack.addModifier(new Modifier({name: 'red'}));
    var error = new Modifier({name: 'error', type: 'logger'});
    stack.addModifier(error);
    assert.equal(typeof stack.current.name, 'undefined');
    stack.setName(error);
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.getModifiers('name'), ['red', 'error']);
    assert.equal(stack.current.name, 'error');

    stack.addModifier(new Modifier({name: 'warn', type: 'logger'}));
    assert.equal(typeof stack.current.name, 'undefined');
    assert.deepEqual(stack.current.getModes('name'), []);
    assert.deepEqual(stack.current.getModifiers('name'), ['warn']);
  });

  it('should add the logger when setting the name and the logger is not already added', function() {
    var stack = new Stack();
    stack.addMode(new Mode({name: 'verbose'}));
    stack.addModifier(new Modifier({name: 'red'}));
    var error = new Modifier({name: 'error', type: 'logger'});
    assert.equal(typeof stack.current.name, 'undefined');
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.getModifiers('name'), ['red']);
    stack.setName(error);
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.getModifiers('name'), ['red', 'error']);
    assert.equal(stack.current.name, 'error');
  });

  it('should create new Stats object using current Stats information as parent', function() {
    // simulates doing `logger.verbose.red.error.warn('foo')`
    var stack = Stack();
    stack.addMode(new Mode({name: 'verbose'}));
    stack.addModifier(new Modifier({name: 'red'}));
    stack.addLogger(new Modifier({name: 'error', type: 'logger'}));

    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.getModifiers('name'), ['red', 'error']);

    var parent = stack.current;
    stack.addLogger(new Modifier({name: 'warn', type: 'logger'}));

    assert.deepEqual(parent.getModes('name'), ['verbose']);
    assert.deepEqual(parent.getModifiers('name'), ['red', 'error']);
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.getModifiers('name'), ['red', 'warn']);
  });

  it('should set the current logger name', function() {
    var stack = new Stack();
    assert.equal(typeof stack.current.name, 'undefined');
    var error = new Modifier({name: 'error'});
    stack.addModifier(error);
    assert.equal(typeof stack.current.name, 'undefined');
    stack.setName(error);
    assert.equal(stack.current.name, 'error');
  });

  it('should call the given function for each item in the stack', function() {
    // simulates doing `logger.verbose.red.error.warn('foo')`
    var stack = Stack();
    stack.addMode(new Mode({name: 'verbose'}));
    stack.addModifier(new Modifier({name: 'red'}));
    stack.addLogger(new Modifier({name: 'error', type: 'logger'}));

    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.getModifiers('name'), ['red', 'error']);

    var parent = stack.current;
    stack.addLogger(new Modifier({name: 'warn', type: 'logger'}));

    assert.deepEqual(parent.getModes('name'), ['verbose']);
    assert.deepEqual(parent.getModifiers('name'), ['red', 'error']);
    assert.deepEqual(stack.current.getModes('name'), ['verbose']);
    assert.deepEqual(stack.current.getModifiers('name'), ['red', 'warn']);

    var items = stack.items;
    stack.process(function(stats, i) {
      assert.deepEqual(stats, items[i]);
    });
  });
});

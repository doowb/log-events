/*!
 * log-events <https://github.com/doowb/log-events>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var capture = require('capture-stream');
var Base = require('../');
var logger;

describe('log-events', function() {
  beforeEach(function() {
    var Logger = Base.create();
    logger = Logger();
    logger.options = {};
  });

  it('should have a _emit method', function() {
    assert.equal(typeof logger._emit, 'function');
  });

  it('should have a emit method', function() {
    assert.equal(typeof logger.emit, 'function');
  });

  it('should have a on method', function() {
    assert.equal(typeof logger.on, 'function');
  });

  it('should have a addLogger method', function() {
    assert.equal(typeof logger.addLogger, 'function');
  });

  it('should have a addMode method', function() {
    assert.equal(typeof logger.addMode, 'function');
  });

  it('should have a default logger `log` method', function() {
    assert.equal(typeof logger.log, 'function');
  });

  it('should add a new logger method', function() {
    assert.equal(typeof logger.write, 'undefined');
    logger.addLogger('write');
    assert.equal(typeof logger.write, 'function');
  });

  it('should add a new mode method', function() {
    assert.equal(typeof logger.verbose, 'undefined');
    logger.addMode('verbose');
    assert.equal(typeof logger.verbose, 'function');
  });

  it('should emit when adding a new logger method', function(cb) {
    logger.on('addLogger', function(name) {
      assert.equal(name, 'write');
      cb();
    });
    logger.addLogger('write');
  });

  it('should emit when adding a new mode method', function(cb) {
    logger.on('addMode', function(name) {
      assert.equal(name, 'verbose');
      cb();
    });
    logger.addMode('verbose');
  });

  it('should change mode and logger methods', function() {
    assert.equal(typeof logger.write, 'undefined');
    assert.equal(typeof logger.verbose, 'undefined');
    logger.addMode('verbose');
    assert.equal(typeof logger.verbose, 'function');
    assert.equal(typeof logger.write, 'undefined');
    logger.addLogger('write');
    assert.equal(typeof logger.verbose, 'function');
    assert.equal(typeof logger.write, 'function');
    assert.equal(typeof logger.verbose.write, 'function');
  });

  it('should allow overwritting set methods', function() {
    assert.equal(typeof logger.write, 'undefined');
    logger.addMode('verbose');
    logger.addMode('not', {type: 'toggle'});
    logger.addLogger('write');
    assert.equal(typeof logger.write, 'function');
    logger.write = function(str) {
      console.error(str);
      return this;
    };
    assert.equal(typeof logger.write, 'function');

    var restore = capture(process.stderr);
    logger.verbose.write('foo')
          .not.verbose.write('bar');
    var output = restore('true');
    assert.equal(output, 'foo\nbar\n');
  });

  it('should allow passing a modifier function when creating a logger', function() {
    logger.addLogger('write', function(msg) {
      return '[LOG]: ' + msg;
    });
    assert.equal(typeof logger.write, 'function');
    assert.equal(logger.modifiers.write.fn('foo'), '[LOG]: foo');
  });

  it('should chain modifiers in current stats object when type is modifier', function(cb) {
    logger.addMode('verbose');
    logger.addLogger('write');
    logger.addLogger('red', {type: 'modifier'});
    logger.on('write', function(stats) {
      assert.deepEqual(stats.getModes('name'), ['verbose']);
      assert.deepEqual(stats.getModifiers('name'), ['red', 'write']);
      assert.deepEqual(stats.args, ['foo']);
      cb();
    });
    logger.verbose.red.write('foo');
  });

  it('should allow passing a modifier function when defining a mode', function() {
    logger.addMode('debug', function(msg) {
      return '[DEBUG]: ' + msg;
    });
    logger.addLogger('write');
    assert.equal(typeof logger.debug, 'function');
    assert.equal(typeof logger.write, 'function');
    assert.equal(logger.modes.debug.fn('foo'), '[DEBUG]: foo');
  });

  it('should allow calling a mode function directly', function(cb) {
    logger.addMode('debug');
    assert.equal(typeof logger.debug, 'function');
    logger.on('log', function(stats) {
      assert.deepEqual(stats.getModes('name'), ['debug']);
      assert.deepEqual(stats.getModifiers('name'), ['log']);
      assert.deepEqual(stats.args, ['foo']);
      cb();
    });
    logger.debug('foo');
  });

  it('should throw an error when an undefined logger name is given to `_emit`', function(cb) {
    try {
      logger._emit('foo', 'bar');
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'Unable to find logger "foo"');
      cb();
    }
  });
});

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

  it('should have an _emit method', function() {
    assert.equal(typeof logger._emit, 'function');
  });

  it('should have an emit method', function() {
    assert.equal(typeof logger.emit, 'function');
  });

  it('should have an on method', function() {
    assert.equal(typeof logger.on, 'function');
  });

  it('should have an emitter method', function() {
    assert.equal(typeof logger.emitter, 'function');
  });

  it('should have a mode method', function() {
    assert.equal(typeof logger.mode, 'function');
  });

  it('should have a style method', function() {
    assert.equal(typeof logger.style, 'function');
  });

  it('should have a default emitter `log` method', function() {
    assert.equal(typeof logger.log, 'function');
  });

  it('should add a new logger method', function() {
    assert.equal(typeof logger.write, 'undefined');
    logger.emitter('write');
    assert.equal(typeof logger.write, 'function');
  });

  it('should add a new mode method', function() {
    assert.equal(typeof logger.verbose, 'undefined');
    logger.mode('verbose');
    assert.equal(typeof logger.verbose, 'function');
  });

  it('should add a new style method', function() {
    assert.equal(typeof logger.red, 'undefined');
    logger.style('red');
    assert.equal(typeof logger.red, 'function');
  });

  it('should emit when adding a new emitter method', function(cb) {
    logger.on('emitter', function(name) {
      assert.equal(name, 'write');
      assert.equal(logger.emitterKeys.indexOf(name) === -1, false);
      cb();
    });
    logger.emitter('write');
  });

  it('should emit when adding a new mode method', function(cb) {
    logger.on('mode', function(name) {
      assert.equal(name, 'verbose');
      assert.equal(logger.modeKeys.indexOf(name) === -1, false);
      cb();
    });
    logger.mode('verbose');
  });

  it('should emit when adding a new style method', function(cb) {
    logger.on('style', function(name) {
      assert.equal(name, 'red');
      assert.equal(logger.styleKeys.indexOf(name) === -1, false);
      cb();
    });
    logger.style('red');
  });

  it('should chain mode and logger methods', function() {
    assert.equal(typeof logger.write, 'undefined');
    assert.equal(typeof logger.verbose, 'undefined');
    logger.mode('verbose');
    assert.equal(typeof logger.verbose, 'function');
    assert.equal(typeof logger.write, 'undefined');
    logger.emitter('write');
    assert.equal(typeof logger.verbose, 'function');
    assert.equal(typeof logger.write, 'function');
    assert.equal(typeof logger.verbose.write, 'function');
  });

  it('should allow overwriting methods', function() {
    assert.equal(typeof logger.write, 'undefined');
    logger.mode('verbose');
    logger.mode('not', {type: 'toggle'});
    logger.emitter('write');
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

  it('should allow passing an emitter function when creating a logger', function() {
    logger.emitter('write', function(msg) {
      return '[LOG]: ' + msg;
    });
    assert.equal(typeof logger.write, 'function');
    assert.equal(logger.emitters.write.fn('foo'), '[LOG]: foo');
  });

  it('should chain emitters in current stats object when type is emitter', function(cb) {
    logger.mode('verbose');
    logger.emitter('write');
    logger.style('red');
    logger.on('write', function(stats) {
      assert.equal(stats.name, 'write');
      assert.deepEqual(stats.getModes('name'), ['verbose']);
      assert.deepEqual(stats.styles, ['red']);
      assert.deepEqual(stats.args, ['foo']);
      cb();
    });
    logger.verbose.red.write('foo');
  });

  it('should allow passing a emitter function when defining a mode', function() {
    logger.mode('debug', function(msg) {
      return '[DEBUG]: ' + msg;
    });
    logger.emitter('write');
    assert.equal(typeof logger.debug, 'function');
    assert.equal(typeof logger.write, 'function');
    assert.equal(logger.modes.debug.fn('foo'), '[DEBUG]: foo');
  });

  it('should allow calling a mode function directly', function(cb) {
    logger.mode('debug');
    assert.equal(typeof logger.debug, 'function');
    logger.on('log', function(stats) {
      assert.equal(stats.name, 'log');
      assert.deepEqual(stats.getModes('name'), ['debug']);
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
      assert.equal(err.message, 'Unable to find emitter "foo"');
      cb();
    }
  });
});

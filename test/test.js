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

  it('should have a create method', function() {
    assert.equal(typeof logger.create, 'function');
  });

  it('should have a mode method', function() {
    assert.equal(typeof logger.mode, 'function');
  });

  it('should have a default logger `log` method', function() {
    assert.equal(typeof logger.log, 'function');
  });

  it('should add a new logger method', function() {
    assert.equal(typeof logger.write, 'undefined');
    logger.create('write');
    assert.equal(typeof logger.write, 'function');
  });

  it('should add a new mode method', function() {
    assert.equal(typeof logger.verbose, 'undefined');
    logger.mode('verbose');
    assert.equal(typeof logger.verbose, 'function');
  });

  it('should change mode and logger methods', function() {
    assert.equal(typeof logger.write, 'undefined');
    assert.equal(typeof logger.verbose, 'undefined');
    logger.mode('verbose');
    assert.equal(typeof logger.verbose, 'function');
    assert.equal(typeof logger.write, 'undefined');
    logger.create('write');
    assert.equal(typeof logger.verbose, 'function');
    assert.equal(typeof logger.write, 'function');
    assert.equal(typeof logger.verbose.write, 'function');
  })
});

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

describe('mode', function() {
  it('should throw an error when `name` is not defined', function(cb) {
    try {
      var mode = new Mode();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected options.name to be set');
      cb();
    }
  });

  it('should throw an error when `type` is not valid', function(cb) {
    try {
      var mode = new Mode({name: 'foo', type: 'bar'});
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, '"type" must be one of [mode, toggle] but got "bar"');
      cb();
    }
  });

  it('should create a new instance', function() {
    var mode = new Mode({name: 'foo'});
    assert(mode);
    assert.equal(mode instanceof Mode, true);
    assert.equal(mode.name, 'foo');
    assert.deepEqual(mode.type, ['mode']);
    assert.equal(mode.options.name, 'foo');
    assert.deepEqual(mode.options.type, ['mode']);
  });

  it('should create a new instance without `new` keyword', function() {
    var mode = Mode({name: 'foo'});
    assert(mode);
    assert.equal(mode instanceof Mode, true);
    assert.equal(mode.name, 'foo');
    assert.deepEqual(mode.type, ['mode']);
    assert.equal(mode.options.name, 'foo');
    assert.deepEqual(mode.options.type, ['mode']);
  });

  it('should create an instance with a custom `type` option', function() {
    var mode = new Mode({name: 'foo', type: 'toggle'});
    assert(mode);
    assert.equal(mode instanceof Mode, true);
    assert.equal(mode.name, 'foo');
    assert.deepEqual(mode.type, ['toggle']);
    assert.equal(mode.options.name, 'foo');
    assert.deepEqual(mode.options.type, ['toggle']);
  });

  it('should allow setting the name after the instance is created', function() {
    var mode = new Mode({name: 'foo'});
    assert.equal(mode.name, 'foo');
    assert.equal(mode.options.name, 'foo');
    mode.name = 'bar';
    assert.equal(mode.name, 'bar');
    assert.equal(mode.options.name, 'bar');
  });

  it('should have an identity function when `fn` is not passed on `options`', function() {
    var mode = new Mode({name: 'foo'});
    assert.deepEqual(mode.fn.toString(), utils.identity.toString());
  });

  it('should have a custom function when `fn` is passed on `options`', function() {
    var mode = new Mode({
      name: 'foo',
      fn: function(str) {
        return 'foo ' + str;
      }
    });
    assert.equal(mode.fn('bar'), 'foo bar');
  });

  it('should allow setting the `fn` after the instance is created', function() {
    var mode = new Mode({
      name: 'foo',
      fn: function(str) {
        return 'foo ' + str;
      }
    });
    assert.equal(mode.fn('bar'), 'foo bar');
    mode.fn = function(str) {
      return str + ' foo';
    };
    assert.equal(mode.fn('bar'), 'bar foo');
  });

  it('should have a custom inspect function that returns the name', function() {
    var mode = new Mode({name: 'foo'});
    assert.equal(mode.inspect(), 'foo');
  })
});

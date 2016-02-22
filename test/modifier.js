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
var Modifier = require('../lib/modifier');

describe('modifier', function() {
  it('should throw an error when `name` is not defined', function(cb) {
    try {
      var modifier = new Modifier();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected options.name to be set');
      cb();
    }
  });

  it('should throw an error when `type` is not valid', function(cb) {
    try {
      var modifier = new Modifier({name: 'foo', type: 'bar'});
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, '"type" must be one of [modifier, logger] but got "bar"');
      cb();
    }
  });

  it('should create a new instance', function() {
    var modifier = new Modifier({name: 'foo'});
    assert(modifier);
    assert.equal(modifier instanceof Modifier, true);
    assert.equal(modifier.name, 'foo');
    assert.deepEqual(modifier.type, ['modifier']);
    assert.equal(modifier.options.name, 'foo');
    assert.deepEqual(modifier.options.type, ['modifier']);
  });

  it('should create a new instance without `new` keyword', function() {
    var modifier = Modifier({name: 'foo'});
    assert(modifier);
    assert.equal(modifier instanceof Modifier, true);
    assert.equal(modifier.name, 'foo');
    assert.deepEqual(modifier.type, ['modifier']);
    assert.equal(modifier.options.name, 'foo');
    assert.deepEqual(modifier.options.type, ['modifier']);
  });

  it('should create an instance with a custom `type` option', function() {
    var modifier = new Modifier({name: 'foo', type: 'logger'});
    assert(modifier);
    assert.equal(modifier instanceof Modifier, true);
    assert.equal(modifier.name, 'foo');
    assert.deepEqual(modifier.type, ['logger']);
    assert.equal(modifier.options.name, 'foo');
    assert.deepEqual(modifier.options.type, ['logger']);
  });

  it('should allow setting the name after the instance is created', function() {
    var modifier = new Modifier({name: 'foo'});
    assert.equal(modifier.name, 'foo');
    assert.equal(modifier.options.name, 'foo');
    modifier.name = 'bar';
    assert.equal(modifier.name, 'bar');
    assert.equal(modifier.options.name, 'bar');
  });

  it('should have an identity function when `fn` is not passed on `options`', function() {
    var modifier = new Modifier({name: 'foo'});
    assert.deepEqual(modifier.fn.toString(), utils.identity.toString());
  });

  it('should have a custom function when `fn` is passed on `options`', function() {
    var modifier = new Modifier({
      name: 'foo',
      fn: function(str) {
        return 'foo ' + str;
      }
    });
    assert.equal(modifier.fn('bar'), 'foo bar');
  });

  it('should allow setting the `fn` after the instance is created', function() {
    var modifier = new Modifier({
      name: 'foo',
      fn: function(str) {
        return 'foo ' + str;
      }
    });
    assert.equal(modifier.fn('bar'), 'foo bar');
    modifier.fn = function(str) {
      return str + ' foo';
    };
    assert.equal(modifier.fn('bar'), 'bar foo');
  });

  it('should have a custom inspect function that returns the name', function() {
    var modifier = new Modifier({name: 'foo'});
    assert.equal(modifier.inspect(), 'foo');
  })
});

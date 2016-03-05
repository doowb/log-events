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
var Emitter = require('../lib/emitter');

describe('emitter', function() {
  it('should throw an error when `name` is not defined', function(cb) {
    try {
      Emitter();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected options.name to be set');
      cb();
    }
  });

  it('should create a new instance', function() {
    var emitter = new Emitter({name: 'foo'});
    assert(emitter);
    assert.equal(emitter instanceof Emitter, true);
    assert.equal(emitter.name, 'foo');
    assert.equal(emitter.level, 100);
    assert.equal(emitter.options.name, 'foo');
    assert.equal(emitter.options.level, 100);
  });

  it('should create a new instance without `new` keyword', function() {
    var emitter = Emitter({name: 'foo'});
    assert(emitter);
    assert.equal(emitter instanceof Emitter, true);
    assert.equal(emitter.name, 'foo');
    assert.equal(emitter.level, 100);
    assert.equal(emitter.options.name, 'foo');
    assert.equal(emitter.options.level, 100);
  });

  it('should create an instance with a custom `level` option', function() {
    var emitter = new Emitter({name: 'foo', level: 3});
    assert(emitter);
    assert.equal(emitter instanceof Emitter, true);
    assert.equal(emitter.name, 'foo');
    assert.equal(emitter.level, 3);
    assert.equal(emitter.options.name, 'foo');
    assert.equal(emitter.options.level, 3);
  });

  it('should allow setting the name after the instance is created', function() {
    var emitter = new Emitter({name: 'foo'});
    assert.equal(emitter.name, 'foo');
    assert.equal(emitter.options.name, 'foo');
    emitter.name = 'bar';
    assert.equal(emitter.name, 'bar');
    assert.equal(emitter.options.name, 'bar');
  });

  it('should have an identity function when `fn` is not passed on `options`', function() {
    var emitter = new Emitter({name: 'foo'});
    assert.deepEqual(emitter.fn.toString(), utils.identity.toString());
  });

  it('should have a custom function when `fn` is passed on `options`', function() {
    var emitter = new Emitter({
      name: 'foo',
      fn: function(str) {
        return 'foo ' + str;
      }
    });
    assert.equal(emitter.fn('bar'), 'foo bar');
  });

  it('should allow setting the `fn` after the instance is created', function() {
    var emitter = new Emitter({
      name: 'foo',
      fn: function(str) {
        return 'foo ' + str;
      }
    });
    assert.equal(emitter.fn('bar'), 'foo bar');
    emitter.fn = function(str) {
      return str + ' foo';
    };
    assert.equal(emitter.fn('bar'), 'bar foo');
  });

  it('should have a custom inspect function that returns the name', function() {
    var emitter = new Emitter({name: 'foo'});
    assert.equal(emitter.inspect(), 'foo');
  });
});

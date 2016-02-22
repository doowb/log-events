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

describe('utils', function() {
  describe('arrayify', function() {
    it('should arrayify a falsey value to an empty array', function() {
      assert.deepEqual(utils.arrayify(null), []);
    });

    it('should arrayify a value to an array', function() {
      assert.deepEqual(utils.arrayify('foo'), ['foo']);
    });

    it('should arrayify an array to an array', function() {
      assert.deepEqual(utils.arrayify(['foo']), ['foo']);
    });
  });

  describe('isLast', function() {
    it('should return `true` when `val` is equal to last value in the array', function() {
      assert.equal(utils.isLast(['foo', 'bar', 'baz'], 'baz'), true);
    });

    it('should return `false` when `val` is not equal to last value in the array', function() {
      assert.equal(utils.isLast(['foo', 'bar', 'baz'], 'foo'), false);
    });

    it('should return `false` when array has no elements', function() {
      assert.equal(utils.isLast([], 'foo'), false);
    });

    it('should return `false` when array is undefined', function() {
      assert.equal(utils.isLast(undefined, 'foo'), false);
    });
  });

  describe('hasType', function() {
    it('should return `true` when `type` is in `types` array.', function() {
      assert.equal(utils.hasType(['foo', 'bar', 'baz'], 'bar'), true);
    });

    it('should return `false` when `type` is not in `types` array.', function() {
      assert.equal(utils.hasType(['foo', 'bar', 'baz'], 'quux'), false);
    });
  });

  describe('assertType', function() {
    it('should not throw an error when all `vals` are in `types`', function(cb) {
      try {
        utils.assertType(['foo', 'bar', 'baz'], ['foo', 'baz']);
        cb();
      } catch(err) {
        cb(err);
      }
    });

    it('should throw an error when one `vals` is not in `types`', function(cb) {
      try {
        utils.assertType(['foo', 'bar', 'baz'], ['foo', 'quux']);
        cb(new Error('expected an error'));
      } catch(err) {
        assert(err);
        assert.equal(err.message, '"type" must be one of [foo, bar, baz] but got "quux"');
        cb();
      }
    });
  });

  describe('identity', function() {
    it('should return value passed in', function() {
      assert.equal(utils.identity('foo'), 'foo');
    });
  });
});

'use strict';

var utils = require('../utils');

module.exports = function(options) {
  var opts = utils.extend({prop: 'options'}, options);
  var prop = opts.prop;
  return function(app) {
    if (typeof app.isEnabled === 'function') return;

    this.define('isEnabled', function(keys) {
      return utils.isEnabled(this[prop], keys, opts);
    });
  };
};

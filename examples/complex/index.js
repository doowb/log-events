// 'use strict';
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose',
    d: 'debug'
  }
});

// setup some smart defaults for command line flags
var utils = require('./utils');
if (argv.hasOwnProperty('verbose') && utils.isFalsey(argv.verbose)) {
  argv.verbose = false;
}
if (argv.hasOwnProperty('debug') && utils.isFalsey(argv.debug)) {
  argv.debug = false;
}

// Our app based on verbalize to show plugin support
var App = require('./app');
var colors = require('./plugins/colors');
var styles = require('./plugins/styles');
var isEnabled = require('./plugins/is-enabled');

// create an instance with the commandline arguments passed in as options
var logger = new App(utils.extend({}, argv));
logger.use(colors());
logger.use(styles());
logger.use(isEnabled());

/**
 * Process an event stats object when an event is emitted.
 *
 * @param {Object} `stats` Event stats object from an emitted event.
 */

logger.define('process', function(stats) {
  // convert modes to an array of strings by `mode.name`
  var modes = stats.modes.map(function(mode) {
    return mode.name;
  });

  // if a mode is set and that mode's option is true
  // on the application options object
  if (this.isEnabled(modes)) {

    // iterate over the modes and apply any of their modifier
    // functions to the arguments.
    var res = stats.modes.reduce(function(acc, mode) {
      return mode.fn(acc);
    }, stats.args);

    // iterate over the modifiers and apply any of their
    // modifier functions to the arguments
    res = stats.modifiers.reduce(function(acc, modifier) {
      return this.stylize(modifier, acc);
    }.bind(this), res);

    // write the modified arguments to process.stdout.
    this.writeln.apply(this, res);
  }
});

/**
 * Logger modes
 */

// just an option setting
logger.addMode('verbose');

// use this as a toggle value
logger.addMode('not', {type: 'toggle'});

// option setting but allows modifying the content
logger.addMode('debug', function(msg) {
  return '[debug]: ' + msg;
});

/**
 * Listen for all emitted events and process the event stats object.
 */
logger.on('*', function(stats) {
  this.process(stats);
});

/**
 * Chain a bunch of log messages together with some verbose and not verbose messages.
 */
logger
  .info('this is a normal info message') // always logged
  .verbose.info('this is a verbose message') // logged when `options.verbose === true`
  .not.verbose.info('this is a not.verbose message') // logged when `options.verbose === false`
  .not.not.verbose.info('this is a not.not.verbose message') // logged when `options.verbose === true`
  .not.verbose.not.info('this is a not.verbose.not message') // logged when `options.verbose === true`
  .writeln();

/**
 * Chain some more to show how some messages can be changed based on if verbose is true or false.
 */
logger
  .verbose.error('--- VERBOSE INFO---').not.verbose.subhead('--- IMPORTANT INFO ---')
  .verbose.inform('inform')
  .verbose.info('info')
  .verbose.warn('warn')
  .verbose.error('error').not.verbose.error('error')
  .verbose.success('success').not.verbose.success('success')
  .writeln();

/**
 * More examples of extreme chaining. Loggers that are set as just modifiers (like red and yellow) don't
 * trigger an event unless used by themselves. Other loggers will trigger events for each one used
 * (like inform, info, warn, error, and success)
 */
logger
  .verbose.red.subhead('--- VERBOSE INFO---').not.verbose.subhead('--- IMPORTANT INFO ---')
  .verbose.yellow.inform.info.warn.error.success('some verbose information')
  .not.verbose.error.success('some not verbose information')
  .writeln();

/**
 * Log out a green message event though it's marked as a 'modifier' or "style"
 */
logger.green('use a style directly');

/**
 * Can even use modes with "styles"
 */
logger.debug.yellow('this is a debug option');

/**
 * Chained examples of using modes directly.
 * Modes default to use the default `.log` method, which
 * may be overriden to use a default style, like making
 * output white.
 */
logger.verbose('this is directly in verbose')
  .not.verbose('this is directly in not verbose')
  .debug('this is directly in debug')
  .not.debug('this is directly in not debug');

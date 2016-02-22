'use strict';

var Logger = require('../');
var logger = new Logger();
logger.options = {};

/**
 * listen for all emitted events
 * events are a stats object that can be used
 * to determine how to log the event
 *
 * ```js
 * {
 *   // associated modes with this event
 *   modes: [],
 *   // modifiers (including the logger method itself)
 *   modifiers: [],
 *   // name of the logger method that triggered the event
 *   name: 'log',
 *   // arguments originally passed into the logger method
 *   args: []
 * }
 * ```
 */

logger.on('*', function(stats) {
  // see [verbalize](https://github.com/jonschlinkert/verbalize) for more advanced usage
  // and built in helpers

  // only run if a mode is not set
  // or if the mode is set and true
  if (stats.modes.length !== 0) {
    var valid = stats.modes.reduce(function(acc, mode) {
      if (acc === false) return acc;
      if (this.options.hasOwnProperty(mode.name) && this.options[mode.name] === true) {
        return true;
      }
    }.bind(this), true);

    if (!valid) return;
  }

  // apply mode modifier functions to the args
  var output = stats.modes.reduce(function(acc, mode) {
    return mode.fn(acc);
  }, stats.args);

  // apply modifier functions to the args before outputing to the console
  output = stats.modifiers.reduce(function(acc, modifier) {
    return modifier.fn(acc);
  }, output);

  console.log.apply(console, ['[' + stats.name + ']:'].concat(output));
});

/**
 * Default `.log` method that just emits
 */

logger.log('this is a simple log event');
console.log();

/**
 * Create custom logger methods with `.create`
 */

logger.create('info');
logger.create('warn');
logger.info('this is a custom log event');
console.log();

/**
 * logger methods can be chained together to emit the same message multiple times
 */

logger.info.warn('chained loggers are both called logged twice');
console.log();

/**
 * Custom logger methods can may also have a type of `modifier`
 * to indicate that it should not be emitted unless called as a method.
 *
 * A modifier function may also be passed through to be set on the modifier
 * for use when the event is emitted.
 */

logger.create('cyan', {type: ['modifier']}, function(msg) {
  return '\u001b[36m' + msg + '\u001b[39m';
});
logger.cyan.info('this is only logged once but with a cyan color');
console.log();

/**
 * Custom modes can be added and used to change the behavior inside event listeners
 */

logger.mode('verbose');

logger.verbose.info('[before setting the option]: this will only be seen if `options.verbose` is `true`');
logger.options.verbose = true;
logger.verbose.info('[after setting the option]: this will only be seen if `options.verbose` is `true`');
console.log();

/**
 * Modes can also have a modifier function applied to be able to add additional information to a message.
 * This needs to be handled inside the event listener.
 */

logger.mode('debug', function(msg) {
  return '\u001b[33m[debug]\u001b[39m: ' + msg;
});

logger.options.debug = true;
logger.debug.log('debug message');
console.log();

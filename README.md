# log-events [![NPM version](https://img.shields.io/npm/v/log-events.svg)](https://www.npmjs.com/package/log-events) [![Build Status](https://img.shields.io/travis/doowb/log-events.svg)](https://travis-ci.org/doowb/log-events)

> Create custom, chainable logging methods that emit log events when called.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm i log-events --save
```

## Usage

### [Logger](index.js#L25)

Create a new `Logger` constructor to allow
updating the prototype without affecting other contructors.

### [.addLogger](index.js#L99)

Add a logger method to emit an event with the given `name`.

**Params**

* `name` **{String}**: the name of the log event to emit
* `options` **{Object}**: Options used when creating the logger method.
* `options.type` **{String|Array}**: Type of logger method being created. Defaults to `logger`. Valid values are `['logger', 'modifier']`
* `fn` **{Function}**: Optional modifier function that can be used to modify an emitted message.
* `returns` **{Object}** `Logger`: for chaining

**Events**

* `emits`: `addLogger` Emits name and new logger instance after adding the logger method.

**Example**

```js
// add a default `write` logger
logger.addLogger('write');

// add a `red` logger that modifies the msg
logger.addLogger('red', {type: 'modifier'}, function(msg) {
  return colors.red(msg);
});

// add an `info` logger that colors the msg
logger.addLogger('info', function(msg) {
  return colors.cyan(msg);
});

// use the loggers:
logger.red.write('this is a read message');
logger.info('this is a cyan message');
```

### [.addMode](index.js#L147)

Add arbitrary modes to be used for creating namespaces for logger methods.

**Params**

* `mode` **{String}**: Mode to add to the logger.
* `options` **{Object}**: Options to describe the mode.
* `options.type` **{String|Array}**: Type of mode being created. Defaults to `mode`. Valid values are `['mode', 'toggle']` `toggle` mode may be used to indicate a "flipped" state for another mode. e.g. `not.verbose` `toggle` modes may not be used directly for emitting log events.
* `fn` **{Function}**: Optional modifier function that can be used to modify an emitted message.
* `returns` **{Object}** `Logger`: for chaining

**Events**

* `emits`: `addMode` Emits the name and new mode instance after adding the mode method.

**Example**

```js
// create a simple `verbose` mode
logger.addMode('verbose');

// create a `not` toggle mode
logger.addMode('not', {type: 'toggle'});

// create a `debug` mode that modifies the message
logger.addMode('debug', function(msg) {
  return '[DEBUG]: ' + msg;
});

// use the modes with loggers from above:
logger.verbose.red.write('write a red message when verbose is true');
logger.not.verbose.info('write a cyan message when verbose is false');
logger.debug('write a message when debug is true');
```

### [Mode](lib/mode.js#L18)

Mode constructor for making a mode object when
a mode is created with `logger.mode()`

**Params**

* `options` **{Object}**: Options to configure the mode.
* `options.name` **{String}**: Required name of the mode
* `options.type` **{String|Type}**: Type of mode to create. Defaults to `mode`. Values may be `['mode', 'toggle']`.

### [type](lib/mode.js#L43)

Type of `mode`. Valid types are ['mode', 'toggle']

**Example**

```js
console.log(verbose.type);
//=> "mode"
console.log(not.type);
//=> "toggle"
```

### [name](lib/mode.js#L69)

Readable name of `mode`.

**Example**

```js
console.log(verbose.name);
//=> "verbose"
console.log(not.name);
//=> "not"
```

### [](lib/mode.js#L97)`fn`

Optional modifier function that accepts a value and returns a modified value. When not present, an identity function is used to return the original value.

**Example**

```js
var msg = "some error message";

// wrap message in ansi codes for "red"
msg = red.fn(msg);
console.log(msg);

//=> "\u001b[31msome error message\u001b[39m";
```

### [Modifier](lib/modifier.js#L18)

Modifier constructor for making a modifier object when
a modifier is created with `logger.create()`

**Params**

* `options` **{Object}**: Options to configure the modifier.
* `options.name` **{String}**: Required name of the modifier
* `options.type` **{String|Type}**: Type of modifier to create. Defaults to `modifier`. Values may be `['modifier', 'logger']`.

### [type](lib/modifier.js#L43)

Type of `modifier`. Valid types are ['modifier', 'logger']

**Example**

```js
console.log(red.type);
//=> "modifier"
console.log(error.type);
//=> "logger"
```

### [name](lib/modifier.js#L69)

Readable name of `modifier`.

**Example**

```js
console.log(red.name);
//=> "red"
console.log(error.name);
//=> "error"
```

### [](lib/modifier.js#L97)`fn`

Optional modifier function that accepts a value and returns a modified value. When not present, an identity function is used to return the original value.

**Example**

```js
var msg = "some error message";

// wrap message in ansi codes for "red"
msg = red.fn(msg);
console.log(msg);

//=> "\u001b[31msome error message\u001b[39m";
```

### [Stats](lib/stats.js#L33)

Stats contructor that contains information about a chained event being built up.

**Params**

* `parent` **{Object}**: Optional stats instance to inherit `modes` and `modifiers` from.

**Example**

```js
{
  // "not" => toggle, "verbose" => mode
  modes: ['not', 'verbose'],

  // "red" => modifier, "subhead" => logger
  modifiers: ['red', 'subhead'],

  // specified when logger is created
  level: 1,

  // name of logger that will trigger an event
  // in this case "red" will not trigger an event
  name: 'subhead',

  // arguments passed into logger function "subhead"
  args: ['foo', 'bar', 'baz']
}
```

### [.addMode](lib/stats.js#L112)

Add a mode to the `modes` array for this stats object.

**Params**

* `mode` **{Object}**: Instance of a Mode to add to the stats object.
* `returns` **{Object}** `this`: for chaining.

**Example**

```js
var verbose = new Mode({name: 'verbose'});
stats.addMode(verbose);
```

### [.getModes](lib/stats.js#L133)

Get the array of modes from the stats object. Optionally, pass a property in and return an array with only the property.

**Params**

* `prop` **{String}**: Optional property to pick from the mode objects to return.
* `returns` **{Array}**: Array of modes or mode properties.

**Example**

```js
var modes = stats.getModes();
//=> [{name: 'verbose'}]
var modeNames = stats.getModes('name');
//=> ['verbose']
```

### [.addModifier](lib/stats.js#L153)

Add a modifier to the `modifiers` array for this stats object.

**Params**

* `modifier` **{Object}**: Instance of a Modifier to add to the stats object.
* `returns` **{Object}** `this`: for chaining.

**Example**

```js
var info = new Modifier({name: 'info'});
stats.addModifier(info);
```

### [.getModifiers](lib/stats.js#L174)

Get the array of modifiers from the stats object. Optionally, pass a property in and return an array with only the property.

**Params**

* `prop` **{String}**: Optional property to pick from the modifier objects to return.
* `returns` **{Array}**: Array of modifiers or modifier properties.

**Example**

```js
var modifiers = stats.getModifiers();
//=> [{name: 'verbose'}]
var modifierNames = stats.getModifiers('name');
//=> ['verbose']
```

### [.addLogger](lib/stats.js#L197)

Add a modifier to the `modifiers` array for this stats object. Same as `addModifier` but also sets the `.name` property on the stats object to indicate this is a complete stats object ready to be emitted.

**Params**

* `modifier` **{Object}**: Instance of a Modifier to add to the stats object.
* `returns` **{Object}** `this`: for chaining.

**Example**

```js
var info = new Modifier({name: 'info'});
stats.addLogger(info);
```

## Related projects

* [falsey](https://www.npmjs.com/package/falsey): Returns true if `value` is falsey. Works for strings, arrays and `arguments` objects with a… [more](https://www.npmjs.com/package/falsey) | [homepage](https://github.com/jonschlinkert/falsey)
* [is-enabled](https://www.npmjs.com/package/is-enabled): Using key paths that may contain "falsey" patterns, check if a property on an object… [more](https://www.npmjs.com/package/is-enabled) | [homepage](https://github.com/doowb/is-enabled)
* [verbalize](https://www.npmjs.com/package/verbalize): A lightweight command line logging utility, with verbose mode and colors by chalk. | [homepage](https://github.com/jonschlinkert/verbalize)

## Generate docs

Generate readme and API documentation with [verb][]:

```sh
$ npm i -d && npm run docs
```

Or, if [verb][] is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/doowb/log-events/issues/new).

## Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](http://twitter.com/doowb)

## License

Copyright © 2016 [Brian Woodward](https://github.com/doowb)
Released under the [MIT license](https://github.com/doowb/log-events/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.1.0, on February 22, 2016._
# Vorpal - Tour

[![Build Status](https://travis-ci.org/vorpaljs/vorpal-tour.svg)](https://travis-ci.org/vorpaljs/vorpal-tour)
[![XO: Linted](https://img.shields.io/badge/xo-linted-blue.svg)](https://github.com/sindresorhus/xo)

A [Vorpal.js](https://github.com/dthree/vorpal) extension for building a mature tour that walks users through your interactive CLI with ease.

### Installation

```bash
npm install vorpal-tour
npm install vorpal
```

### Getting Started

Simply use `vorpal.use(tour, options)` to add the tour as a Vorpal extension. 

```js
const vorpal = require('vorpal')();
const vorpalTour = require('vorpal-tour');

vorpal.use(vorpalTour, {
  command: 'tour',
  tour: function(tour) {
    // add tour steps, etc.
    return tour;
  }
});
```
##### Options

- `command`: The name of the Vorpal command that will invoke the tour. Defaults to `tour`. By running `use` more than once, you can invoke multiple, separate tours.

- `tour`: Expects a function that passes in a `tour` object. You then add steps and details to the tour, and return the `tour` object.

##### Building the tour

The `tour` object has a few basic commands to help you easily build a tour.

```js
vorpal.use(vorpalTour, {
  command: 'tour',
  tour: function(tour) {
    // Colors the "tour guide" text. 
    tour.color('cyan');

    // Adds a step to the tour:
    // .begin spits user instructions when the step starts
    // .expect listens for an event. The function it calls 
    //   expects a `true` to be called in order for the step 
    //   to finish.
    // .reject spits text to the user when `false` is returned 
    //   on an `.expect` callback.
    // .wait waits `x` millis before completing the step
    // .end spits text to the user when the step completes.
    tour.step(1)
      .begin('Welcome to the tour! Run "foo".')
      .expect("command", function (data, cb) {
        cb(data.command === 'foo');
      })
      .reject('Uh.. Let\'s type "foo" instead..')
      .wait(500)
      .end('\nNice! Wasn\'t that command just amazing?\n');

    // A delay in millis between steps.
    tour.wait(1000);

    // Ends the tour, spits text to the user.
    tour.end('Very well done!');

    return tour;
  }
});
```

```bash
$ node ./myapp.js
myapp~$ tour

  ┌────────────────────────────────────────────────────────────┐
  |  Welcome to the tour! Run "foo".                           |
  └────────────────────────────────────────────────────────────┘

myapp$ bar

  ┌────────────────────────────────────────────────────────────┐
  |  Uh.. Let's type "foo" instead.                            |
  └────────────────────────────────────────────────────────────┘

myapp$ foo
bar
(... 500 millis ...)

  ┌────────────────────────────────────────────────────────────┐
  |  Nice! Wasn't that command just amazing?                   |
  └────────────────────────────────────────────────────────────┘

(... 1000 millis ...)

  ┌────────────────────────────────────────────────────────────┐
  |  Very well done!                                           |
  └────────────────────────────────────────────────────────────┘

myapp~$
```

### Examples

- [A basic, silly tour](https://github.com/vorpaljs/vorpal-tour/blob/master/examples/silly-tour.js)
- [Wat's tour](https://github.com/dthree/wat/blob/master/src/tour.js)

### API

#### tour

##### tour.color(chalkColor)

Sets the color of the text that guides the tour. Based on [Chalk](https://github.com/chalk/chalk) colors.

```js
tour.color('magenta');
tour.step(1).begin('This is now magenta. Almost like unicorns.');
```

```
  ┌────────────────────────────────────────────────────────────┐
  |  This is now magenta. Almost like unicorns.                |
  └────────────────────────────────────────────────────────────┘
```

##### tour.prepare(function)

Runs a method just before the tour beings, in preparation for the tour. Expects a callback.

```js
tour.prepare(function (callback) {
  vorpal.log('preparing...');
  callback();
});
```

##### tour.step(number)

Creates a new step in the tour, returning a chainable `Step` instance. See the step section below.

*The step number does nothing for now, outside of giving you sanity. This may change.*

```js
var step = tour.step(1);
// ... now do things with the step
```

##### tour.wait(millis)

Delays a number of millis between multiple steps. The delay begins at the completion of the step.

```js
tour.step(1); // ...

tour.wait(1000);

tour.step(2); // ...
```

##### tour.end([message])

Ends the tour, optionally printing a message for the user.

```js
tour.step(895); // ...
tour.end('You really made it through all that? Wow. Well done.');
```

##### tour.cleanup(function)

Runs a method directly after the tour ends, in case you need to run cleanup code. Expects a callback.

```js
tour.cleanup(function (callback) {
  mess.cleanup();
  callback();
});
```

#### step

##### step.begin(message)

Prints a message for the user at the start of the step.

```js
tour.step(1).begin('To get started, touch your toes.');
```

```
  ┌────────────────────────────────────────────────────────────┐
  |  To get started, touch your toes.                          |
  └────────────────────────────────────────────────────────────┘
```

##### step.expect(event, function)

This is the listener that determines when the step has been completed.

Expects an event emitted from Vorpal. On each instance of the event, the `function` parameter is called, and expects you to return a callback passing `true` or `false`. On `true`, the step is considered to be fullfilled and will proceed to end.

```js
tour.step(1)
  .begin('run "foo"')
  .expect("command", function (data, cb) {
    cb(data.command === 'foo');
  });
```

While standard events are supported, you can emit your own custom events from Vorpal, if needed.

Standard events:

`command`: returns `{command: 'foo'}`

`keypress`: returns `{ key, value, event }`

`submit`: returns `{}`

##### step.reject(message)

If a `step.expect` is triggered and `false` is returned (meaning the event was not fulfilled), you can optionally print a reject message that instructs the user that they did the command incorrectly. This will print with a yellow border.

```js
tour.step(1)
  .begin('run "foo"')
  .expect("command", function (data, cb) {
    cb(data.command === 'foo');
  })
  .reject('Okay, let\'s type "foo".');
```

##### step.wait(millis)

Once a step has been fulfilled, you can optionally wait a given amount of millis before completion.

```js
tour.step(1)
  .begin('run "foo"')
  .expect("command", function (data, cb) {
    cb(data.command === 'foo');
  })
  .wait(1000);
```

##### step.end(message)

Once a step has been fulfilled and the any `step.wait()` time has passed, you can optionally add a final remark to the user before moving on to the next step, such as a comment on the last one.

```js
tour.step(1)
  .begin('run "foo"')
  .expect("command", function (data, cb) {
    cb(data.command === 'foo');
  })
  .wait(1000)
  .end('Nice! Isn\'t that just foobar?');
```

### Related

- [Vorpal](https://github.com/dthree/vorpal)
- [Awesome - Vorpal](https://github.com/vorpaljs/awesome-vorpaljs)

### License

MIT © [David Caccavella](https://github.com/dthree)


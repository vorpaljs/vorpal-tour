# Vorpal - Tour

[![Build Status](https://travis-ci.org/vorpaljs/vorpal-tour.svg)](https://travis-ci.org/vorpaljs/vorpal-tour)
[![XO: Linted](https://img.shields.io/badge/xo-linted-blue.svg)](https://github.com/sindresorhus/xo)

A [Vorpal.js](https://github.com/dthree/vorpal) that let's you build a mature tour that walks users through your interactive CLI with ease.

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

- `command`: The name of the Vorpal command that will invoke the tour. Defaults to `tour`. By running `use` mroe than once, you can invoke multiple, separate tours.

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

### API

Details coming soon...

#### tour

- `tour.color(chalkColor)`

- `tour.prepare(function)`

- `tour.step(number) : new Step()`

- `tour.wait(millis)`

- `tour.end(message)`

#### step

- `step.begin(message)`

- `step.expect(event, function)`

##### Supported Events

`command`
`keypress`
`submit`

- `step.wait(millis)`

- `step.end(message)`

### Examples

- [A basic, silly tour](https://github.com/vorpaljs/vorpal-tour/blob/master/examples/silly-tour.js)
- [Wat's tour](https://github.com/dthree/wat/blob/master/src/tour.js)

### Related

- [Vorpal](https://github.com/dthree/vorpal)
- [Awesome - Vorpal](https://github.com/vorpaljs/awesome-vorpaljs)

### License

MIT © [David Caccavella](https://github.com/dthree)


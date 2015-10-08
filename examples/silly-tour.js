'use strict';

const vorpal = require('vorpal')();
const vorpalTour = require('../dist/tour.js');

vorpal.command('foo')
  .action(function (args, cb) {
    this.log('bar');
    cb();
  });

vorpal.use(vorpalTour, {
  command: 'tour',
  tour: defineTour
});

vorpal
  .delimiter('myamazingapp~$')
  .show()
  .parse(process.argv);

function defineTour(tour) {
  tour.color('cyan');

  tour.prepare(function (callback) {
    // do anything you need to
    // just before the tour starts.
    callback();
  });

  tour.step(1)
    .begin('\nWelcome to my amazing app!\n\nTo start, run "foo".\n')
    .expect('command', function (data, cb) {
      cb(data.command === 'foo');
    })
    .reject('Uh.. Let\'s type "foo" instead..')
    .wait(500)
    .end('\nNice! Wasn\'t that command just amazing?\n');

  tour.wait(1000);

  tour.step(2)
    .begin('\nNow press the left arrow key, and then the right one!\n')
    .expect('keypress', function (keypress, cb) {
      this._cache = this._cache || 0;
      if (keypress.key === 'left' && this._cache === 0) {
        this._cache = 1;
      } else if (keypress.key === 'right' && this._cache === 1) {
        this._cache = 2;
      } else {
        this._cache = 0;
      }
      cb(this._cache === 2);
    });

  tour.end('\nVery well done! You\'re such a master at my app!\n');

  return tour;
}

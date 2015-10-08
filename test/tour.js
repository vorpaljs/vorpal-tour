'use strict';

require('assert');

var should = require('should');
var tour = require('./../dist/tour');
var vorpal = require('vorpal')();

describe('vorpal-tour', function () {
  it('should exist and be a function', function () {
    should.exist(tour);
    tour.should.be.type('function');
  });

  it('should import into Vorpal', function () {
    (function () {
      vorpal.use(tour);
    }).should.not.throw();
  });

  it('should exist as a command in Vorpal', function () {
    var exists = false;
    for (var i = 0; i < vorpal.commands.length; ++i) {
      if (vorpal.commands[i]._name === 'tour') {
        exists = true;
      }
    }
    exists.should.be.true;
  });
});

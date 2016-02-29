var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('lodash');
var db = require('../db');

router.get('/', function(req, res) {
  var result = {};
  var parallel = [];

  var start = req.query.start_date ? new Date(req.query.start_date) : null;
  var end = req.query.end_date ? new Date(req.query.end_date) : null;

  if (!start || !end) {
    return res
      .send({
        error: 'missing information'
      });
  }

  weeklyRangeIterator(start, end, function(err, payload) {
    if (err) {
      console.error('An error occured: ', err);
      // handle returning errors differently
      return res
        .status(204)
        .end();
    }

    return res
      .status(200)
      .send(payload);
  });
});

module.exports = router;

function dateStringFormatter(date) {
  var year = date.getUTCFullYear();
  var month = date.getUTCMonth() + 1;
  var date = date.getUTCDate();
  if (month < 10) {
    month = '0' + JSON.stringify(month);
  }

  if (date < 10) {
    date = '0' + JSON.stringify(date);
  }

  return year + '-' + month + '-' + date;
}

function createDateKey(dates) {
  return dateStringFormatter(dates[0]) + '-' + dateStringFormatter(dates[1]);
}

function weeklyRangeIterator(startingPoint, endingPoint, callback) {
  var SECOND = 1000;
  var MINUTE = SECOND * 60;
  var HOUR = MINUTE * 60;
  var DAY = HOUR * 24;
  var WEEK = DAY * 7;

  // Added an extra day for the week offset
  var weeks = _.range(startingPoint.valueOf(), endingPoint.valueOf(), WEEK + DAY);

  if (!weeks.length) {
    weeks[0] = startingPoint.valueOf();
  }
  weeks = weeks.map(function(start) {
    return [start, start + WEEK];
  });

  var lastWeek = weeks[weeks.length - 1];

  if (lastWeek[1] < endingPoint.valueOf()) {
    weeks.push([lastWeek[1] + DAY, endingPoint.valueOf()]);
  }

  if (lastWeek[1] > endingPoint.valueOf()) {
    lastWeek[1] = endingPoint.valueOf();
  }

  weeks = weeks.map(function(week) {
    return week.map(function(time) {
      return new Date(time);
    });
  });

  var result = {};

  var parallel = weeks.map(function(week) {
    return function(cb) {
      getStateCountForRange(week, function(err, stats) {
        if (err) {
          return cb(err);
        }

        var resultKey = createDateKey(week);
        result[resultKey] = stats;
        cb();
      });
    }
  });

  async.parallelLimit(parallel, 25, function(err) {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
}

function getStateCountForRange(ranges, callback) {
  var start = ranges[0];
  var end = ranges[1];

  var parallel = [];
  var result = {};

  var states = [
    'applied',
    'quiz_started',
    'quiz_completed',
    'onboarding_requested',
    'onboarding_completed',
    'hired',
    'rejected',
  ];

  states.forEach(function(state) {
    var opt = {
      start_date: dateStringFormatter(start),
      end_date: dateStringFormatter(end)
    };

    opt.state = state;
    parallel.push(function(cb) {
      db.countDatesAndStates(opt, function(err, count) {
        if (err) {
          return cb(err);
        }

        result[state] = count;
        cb();
      });
    });
  });

  async.parallel(parallel, function(err) {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  });
}
var express = require('express');
var router = express.Router();
var async = require('async');
var ReactServer = require('react-dom/server');
var React = require('react');
var AppContainer = require('../src/main/AppContainer').default;
var db = require('../db');

router.get('/', function(req, res) {
  var series = [];
  var user = {};
  var session = req.session;
  if (session.email) {
    series.push(function(callback) {
      db.query({
        email: session.email
      }, function(err, users) {
        if (err) {
          return callback(err);
        }
        if (users.length) {
          user = users[0];
        }

        callback();
      });
    });
  }

  series.push(function(callback) {
    res.write(`
      <!DOCTYPE html>
        <html>
        <head>
          <title>Shopper</title>
          <link rel="stylesheet" href="/css/bundle.css" />
        </head>
        <body>
          <div id="app">`
    );
    res.write(
      ReactServer.renderToString(
        React.createElement(AppContainer, { data: user })
      )
    );
    res.write('</div><script id="data" type="json">')
    const jsonString = JSON.stringify(user);
    res.write(jsonString);
    res.write(`
          </script>
          <script src="/js/bundle.js"></script>
        </body>
      </html>`);
    callback();
  });

  async.series(series, function(err) {
    if (err) {
      return console.error(err);
    }
    res.end();
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var ReactServer = require('react-dom/server');
var React = require('react');
var AppContainer = require('../src/main/AppContainer').default;

router.get('/', function(req, res) {
  // const user = {
  //   first_name: 'Warren',
  //   last_name: 'Ng',
  //   phone_number: 6466888186,
  //   city: 'san_francisco'
  // };
  const user = {};
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
  console.log(jsonString);
  res.write(jsonString);
  res.write(`
        </script>
        <script src="/js/bundle.js"></script>
      </body>
    </html>`);
  res.end();
});

module.exports = router;

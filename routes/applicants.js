var express = require('express');
var validator = require('validator');
var router = express.Router();
var db = require('../db');

router.post('/', function(req, res) {
  req.body.user = req.body.user || {};
  if (!req.session.email && (!req.body.user.email || !validator.isEmail(req.body.user.email))) {
    return res.send({
      error: 'invalid email'
    });
  }

  var user = req.body.user;

  db.updateOrInsert(user, function(err, user) {
    if (err) {
      console.error('An error occured: ', err);
      // handle returning errors differently
      return res
        .status(204)
        .end();
    }

    if (!req.session.email) {
      req.session.email = user.email;
    }

    var payload = {};
    payload.user = user;
    console.log('sending back new user: ', payload);
    return res
      .status(200)
      .send(payload);
  });
});

module.exports = router;

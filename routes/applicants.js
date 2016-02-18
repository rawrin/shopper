var express = require('express');
var router = express.Router();

// post for applicants going into the database
// should create applicant with email
// save the email into the session data.
// if email already exists in teh database and form is complete then do nothing, tell client to go to end steps
// if form is incomplete, then update "updatedAt"
router.post('/', function(req, res, next) {

});

/*
{
  email:
  first_name:
  last_name:
  phone_number:
  city:
  complete: 
  
  }
 */

module.exports = router;

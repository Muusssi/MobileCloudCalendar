var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

/* GET users listing. */
router.route('/')
  //POST a new user
  .post(function(req, res) {
      // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
      var username = req.body.username;
      var password = req.body.password;
      var email = req.body.email;
      var calendar = req.body.calendar;
      //call the create function for our database
      mongoose.model('User').create({
          username : username,
          password : password,
          email : email,
          calendar : calendar,
      }, function (err, user) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Calendar has been created
                console.log('POST creating new user: ' + user);
                res.format({
                  html: function(){
                      res.json(user);
                  },
                  //JSON response will show the newly created user
                  json: function(){
                      res.json(user);
                  }
              });
            }
      })
  });

module.exports = router;

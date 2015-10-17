var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


//build the REST operations at the base for calendars
//this will be accessible from http://127.0.0.1:3000/calendars if the default route for / is left unchanged
router.route('/')
    //GET all calendars
    .get(function(req, res, next) {
        //retrieve all calendars from Monogo
        mongoose.model('Calendar').find({}, function (err, calendars) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                    html: function(){
                        res.json(calendars);
                    },
                    //JSON response will show all calendars in JSON format
                    json: function(){
                        res.json(calendars);
                    }
                });
              }     
        });
    })
    //POST a new calendar
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var description = req.body.description;
        var events = req.body.events;
        //call the create function for our database
        mongoose.model('Calendar').create({
            name : name,
            description : description,
            events : events,
        }, function (err, calendar) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Calendar has been created
                  console.log('POST creating new calendar: ' + calendar);
                  res.format({
                    html: function(){
                        res.json(calendar);
                    },
                    //JSON response will show the newly created calendar
                    json: function(){
                        res.json(calendar);
                    }
                });
              }
        })
    });


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Calendar').findById(id, function (err, calendar) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});


router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Calendar').findById(req.id, function (err, calendar) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + calendar._id);
        res.format({
          html: function(){
              res.json(calendar);
          },
          json: function(){
              res.json(calendar);
          }
        });
      }
    });
  });



//GET the individual calendar by Mongo ID
router.get('/:id/edit', function(req, res) {
    //search for the calendar within Mongo
    mongoose.model('Calendar').findById(req.id, function (err, calendar) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the calendar
            console.log('GET Retrieving ID: ' + calendar._id);
            res.format({
                html: function(){
                	res.json(calendar);
                 },
                 //JSON response will return the JSON output
                json: function(){
                    res.json(calendar);
                 }
            });
        }
    });
});



//PUT to update a calendar by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var description = req.body.description;
    var events = req.body.events;

   //find the document by ID
    mongoose.model('Calendar').findById(req.id, function (err, calendar) {
        //update it
        calendar.update({
            name : name,
            description : description,
        }, function (err, calendarID) {
          if (err) {
              res.send("There was a problem updating the information to the database: " + err);
          } 
          else {
              res.format({
                  html: function(){
                    res.json(calendar);
                 },
                 //JSON responds showing the updated values
                json: function(){
                       res.json(calendar);
                 }
              });
           }
        })
    });
});


//DELETE a calendar by ID
router.delete('/:id/edit', function (req, res){
    //find calendar by ID
    mongoose.model('Calendar').findById(req.id, function (err, calendar) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            calendar.remove(function (err, calendar) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + calendar._id);
                    res.format({
                          html: function(){
                           res.json({message : 'deleted',
                               item : calendar
                           });
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                           res.json({message : 'deleted',
                               item : calendar
                           });
                         }
                      });
                }
            });
        }
    });
});



module.exports = router;




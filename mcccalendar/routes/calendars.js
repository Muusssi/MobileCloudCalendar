var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

// router.use(function (req, res, next) {
//
//   next();
// });
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))
// router.use(methodOverride('_method'))

//build the REST operations at the base for calendars
//this will be accessible from http://127.0.0.1:3000/calendars if the default route for / is left unchanged
router.route('/')
    //GET all calendars
    .get(function(req, res, next) {
        //retrieve all calendars from Monogo
        mongoose.model('Calendar').find({}, function (err, calendars) {
              console.log('but comes here...');
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                    html: function(){
                        res.render('calendars', { calendars: calendars });
                    },
                    //JSON response will show all calendars in JSON format
                    json: function(){
                        console.log("JSON!");
                        res.json(calendars);
                        // res.render('calendars', { objects: calendars });
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
        var userID = req.body.userID;
        //call the create function for our database
        mongoose.model('Calendar').create({
            name : name,
            description : description,
            events : events,
            creator : userID,
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
            console.log(req.id + ' was not found');
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
          if (calendar == null) {
            console.log(req.id + ' was not found');
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
          }
          else {
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
          if (calendar == null) {
            console.log(req.id + ' was not found');
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
          }
          else {
            //remove it from Mongo
            calendar.remove(function (err, calendar) {
                if (err) {
                    return console.error(err);
                } else {
                    mongoose.model('CalendarEvent').find({ 'calendar': req.id }).remove();
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
        }
    });
});







//build the REST operations at the base for calendarEvents
//this will be accessible from http://127.0.0.1:3000/calendars/:id/events if the default route for / is left unchanged
router.route('/:id/events')
    //GET all calendarEvents
    .get(function(req, res, next) {
        //retrieve all calendars from Monogo
        mongoose.model('CalendarEvent').find({'calendar' : req.id},function (err, calendarEvents) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header

                  res.format({
                    html: function(){
                      res.render('events', { events: calendarEvents, site_url:req.originalUrl.replace(/\/+$/, "") });
                        // res.json(calendarEvents);
                    },
                    //JSON response will show all calendars in JSON format
                    json: function(){
                        res.json(calendarEvents);
                    }
                });
              }
        });
    })
    //POST a new calendarEvent
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var title = req.body.title;
        var description = req.body.description;
        var location = req.body.location;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        console.log("req.googleCalendarId:");
        console.log(req.googleCalendarId);
        mongoose.model('CalendarEvent').findOne({'calendar': req.id, 'googleCalendarId':req.googleCalendarId},function (err, calendarEvent) {
          if (req.googleCalendarId == undefined || calendarEvent == null) {
            console.log("New calendar event added");
            //call the create function for our database
            mongoose.model('CalendarEvent').create({
                title : title,
                description : description,
                location : location,
                startTime : startTime,
                endTime : endTime,
                etag: req.etag,
                googleCalendarId: req.googleCalendarId,
                calendar : req.id,
            }, function (err, calendarEvent) {

              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  res.redirect("/calendars/"+req.id+"/events");
              }
            });
          }
          else {
            calendarEvent.update({
                title : title,
                description : description,
                location : location,
                startTime : startTime,
                endTime : endTime,
                etag: req.etag,
                calendar : req.id,
              }, function (err, calendarEvent) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                }
                else {
                  res.format({
                    html: function(){
                        res.redirect("/calendars/"+req.id+"/events");
                     },
                     //JSON responds showing the updated values
                    json: function(){
                        res.json(calendarEvent);
                    }
                  });
                }
            });
          }
        });

    });

// Display new Event Form
router.route('/:id/events/create')
    //GET all calendarEvents
    .get(function(req, res, next) {

                  res.format({
                    html: function(){
                      res.render('events_create', {site_url:req.originalUrl.replace("/create","")});
                        // res.json(calendarEvents);
                    },
                    //JSON response will show all calendars in JSON format
                    json: function(){
                        res.json(calendarEvents);
                    }
                });
    });

router.route('/:id/events/text-search')
    //text search all calendarEvents in calendar
    .post(function(req, res, next) {
        var search = req.body.search;
        //retrieve all calendars from Monogo
        mongoose.model('CalendarEvent').find({'calendar' : req.id, $text : { $search : search }},function (err, calendarEvents) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                    html: function(){
                        res.json(calendarEvents);
                    },
                    //JSON response will show all calendars in JSON format
                    json: function(){
                        res.json(calendarEvents);
                    }
                });
              }
        });
    })

router.route('/:id/events/time-search')
    // time search all calendarEvents in calendar
    // searches all events that begin within the given search time interval
    .post(function(req, res, next) {
        var begin = req.body.begin;
        var end = req.body.end;
        //retrieve all calendars from Monogo
        //mongoose.model('CalendarEvent').find({'calendar': req.id, 'startTime': { '$lte' : end }, 'endTime': { '$gte' : begin } },function (err, calendarEvents) {
        mongoose.model('CalendarEvent').find( {'calendar' : req.id, 'endTime' : {$gte : begin}, 'startTime' : {$lte : end} } ,function (err, calendarEvents) {

              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                    html: function(){
                        res.json(calendarEvents);
                    },
                    //JSON response will show all calendars in JSON format
                    json: function(){
                        res.json(calendarEvents);
                    }
                });
              }
        });
    })

// route middleware to validate :eventId
router.param('eventId', function(req, res, next, eventId) {
    //console.log('validating ' + eventId + ' exists');
    //find the ID in the Database
    mongoose.model('CalendarEvent').findById(eventId, function (err, calendarEvent) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(eventId + ' was not found');
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
            req.eventId = eventId;
            // go to the next thing
            next();
        }
    });
});


router.route('/:id/events/:eventId')
  .get(function(req, res) {
    mongoose.model('CalendarEvent').findOne({'_id':req.eventId, 'calendar':req.id}, function (err, calendarEvent) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        if (calendarEvent == null) {
          console.log(req.eventId + ' was not found');
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
        }
        else {
          res.format({
            html: function(){
                res.render('event',{cal_event:calendarEvent});
            },
            json: function(){
                res.json(calendarEvent);
            }
          });
        }

      }
    });
  });



//GET the individual calendar by Mongo ID
router.route('/:id/events/:eventId/edit')
  .get(function(req, res) {
    mongoose.model('CalendarEvent').findOne({'_id':req.eventId, 'calendar':req.id}, function (err, calendarEvent) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        res.format({
          html: function(){
              res.render('events_create', {cal_event:calendarEvent, site_url:req.originalUrl.replace("/create","")});
          },
          json: function(){
              res.json(calendarEvent);
          }
        });
      }
    });
  });



//PUT to update a calendar by ID
router.put('/:id/events/:eventId/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var title = req.body.title;
    var description = req.body.description;
    var location = req.body.location;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    //find the document by ID
    mongoose.model('CalendarEvent').findOne({'_id':req.eventId, 'calendar':req.id}, function (err, calendarEvent) {
        //update it
        if (calendarEvent == null) {
          console.log("No calendar event found")
        }
        else {
          calendarEvent.update({
              title : title,
              description : description,
              location : location,
              startTime : startTime,
              endTime : endTime,
              calendar : req.id,
          }, function (err, calendarEvent) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                res.format({
                    html: function(){
                      res.redirect("/calendars/"+req.id+"/events");
                   },
                   //JSON responds showing the updated values
                  json: function(){
                      res.json(calendarEvent);
                   }
                });
            }
          });
      }
    });
});


//DELETE a calendar by ID
router.delete('/:id/events/:eventId/edit', function (req, res){
    //find calendar by ID
    mongoose.model('CalendarEvent').findOne({'_id':req.eventId, 'calendar':req.id}, function (err, calendarEvent) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            calendarEvent.remove(function (err, calendarEvent) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + calendarEvent._id);
                    res.format({
                          html: function(){
                           res.redirect("/calendars/"+req.id+"/events");
                         },
                         //JSON returns the item with the message that is has been deleted
                        json: function(){
                           res.json({message : 'deleted',
                               item : calendarEvent
                           });
                         }
                      });
                }
            });
        }
    });
});


module.exports = router;

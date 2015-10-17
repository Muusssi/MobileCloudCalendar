var mongoose = require('mongoose');  
var calendarSchema = new mongoose.Schema({  
  name: String,
  description: String,
  events: {type: mongoose.Schema.Types.ObjectId, ref: 'CalendarEvent'},
});
mongoose.model('Calendar', calendarSchema);


var calendarEventSchema = new mongoose.Schema({  
  title: String,
  description: String,
  location: Number,
  startTime: Date,
  endTime: Date,
});
mongoose.model('CalendarEvent', calendarEventSchema);
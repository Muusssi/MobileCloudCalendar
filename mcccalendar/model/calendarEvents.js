
var mongoose = require('mongoose'); 

var calendarEventSchema = new mongoose.Schema({  
  title: String,
  description: String,
  location: String,
  startTime: Date,
  endTime: Date,
  calendar: {type: mongoose.Schema.Types.ObjectId, ref: 'Calendar'},
});
mongoose.model('CalendarEvent', calendarEventSchema);
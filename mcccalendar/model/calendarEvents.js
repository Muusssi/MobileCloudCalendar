
var mongoose = require('mongoose'); 

var calendarEventSchema = new mongoose.Schema({  
  title: String,
  description: String,
  location: String,
  startTime: Date,
  endTime: Date,
  etag: {type: String, default: null},
  googleCalendarId: {type: String, default: null},
  calendar: {type: mongoose.Schema.Types.ObjectId, ref: 'Calendar'},
});

calendarEventSchema.index({ title: 'text', description: 'text', location: 'text'});

mongoose.model('CalendarEvent', calendarEventSchema);

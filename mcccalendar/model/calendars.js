var mongoose = require('mongoose');
var calendarSchema = new mongoose.Schema({
  name: String,
  description: String,
  events: [{type: mongoose.Schema.Types.ObjectId, ref: 'CalendarEvent'}],
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});
mongoose.model('Calendar', calendarSchema);

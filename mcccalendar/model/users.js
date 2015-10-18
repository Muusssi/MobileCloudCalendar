var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  calendar: {type: mongoose.Schema.Types.ObjectId, ref: 'Calendar'},
});
mongoose.model('User', userSchema);

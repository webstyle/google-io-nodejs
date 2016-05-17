var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Messages', new Schema({
  id: String,
  username: String,
  text: String,
  created_at: String,
}));

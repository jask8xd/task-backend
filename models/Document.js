var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String
});

module.exports = mongoose.model('Document', DocumentSchema);

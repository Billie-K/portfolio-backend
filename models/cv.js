const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CVSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },  // Raw CV content or a link to the uploaded file
  parsed_data: { type: Schema.Types.Mixed, required: true },  // JSON object with parsed CV data
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CV', CVSchema);

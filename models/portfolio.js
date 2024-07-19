const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eduExpSchema = new Schema({
  title: String,
  summary: String
});

const PortfolioSchema = new Schema({
  // user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  experience: [eduExpSchema],
  education: [eduExpSchema],
  skills: String,
  certifications: String,
  avatar: String,
  bio: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);

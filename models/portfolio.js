const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  sections: [{ type: Schema.Types.Mixed, required: true }],  // JSON array with portfolio sections (e.g., bio, projects, skills)
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);

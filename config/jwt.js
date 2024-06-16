require('dotenv').config();

// Secret key
const secret = process.env.SECRET;

// Token lifespans
const tokenLife = 60 * 60 * 24; // 1 day (in seconds)
const refreshTokenLife = 60 * 60 * 24 * 30; // 30 days (in seconds)

module.exports = { tokenLife, refreshTokenLife, secret };
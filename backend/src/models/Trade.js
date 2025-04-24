// backend/src/models/Trade.js
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  symbol:    { type: String, required: true },                  // e.g. "AAPL"
  action:    { type: String, enum: ['buy','sell'], required: true }, // buy or sell
  price:     { type: Number, required: true },                  // trade price
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);
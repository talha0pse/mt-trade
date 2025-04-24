// backend/src/models/Trade.js
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  symbol:    { type: String, required: true },
  action:    { type: String, enum: ['buy','sell'], required: true },
  price:     { type: Number, required: true },
  userId:    { type: String, required: true },           // <- changed from ObjectId to String
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);

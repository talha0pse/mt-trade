// backend/src/models/Trade.js
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  symbol:    { type: String, required: true },
  action:    {
    type: String,
    enum: ['buy','sell'],     // allow only these values
    required: true,
    lowercase: true           // auto-lowercase incoming values (e.g. 'SELL' → 'sell') :contentReference[oaicite:0]{index=0}
  },
  price:     { type: Number, required: true },
  userId:    { type: String, required: true }, // string since we store numeric IDs as strings
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', tradeSchema);

// backend/src/routes/tradeRoutes.js
const express = require('express');
const auth    = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const Trade   = require('../models/Trade');
const router  = express.Router();

// List all trades
router.get('/', async (req, res, next) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });
    res.json(trades);
  } catch (err) {
    next(err); // pass errors to Express/Sentry error handler :contentReference[oaicite:2]{index=2}
  }
});

// Create (buy/sell) a trade
router.post('/', auth, async (req, res, next) => {
  try {
    const { symbol, action, price } = req.body;
    if (!symbol || !action || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const trade = await Trade.create({ symbol, action, price, userId: req.userId });
    res.status(201).json(trade);
  } catch (err) {
    next(err);
  }
});

// Update a trade
router.put('/:id', auth, async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ error: 'Trade not found' });
    if (trade.userId !== req.userId) return res.status(403).json({ error: 'Not authorized' });
    Object.assign(trade, req.body);
    await trade.save();
    res.json({ message: 'Trade updated', trade });
  } catch (err) {
    next(err);
  }
});

// Delete a trade
const deleteTradeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many delete requests, please try again later.' },
});
router.delete('/:id', auth, deleteTradeLimiter, async (req, res, next) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ error: 'Trade not found' });
    if (trade.userId !== req.userId) return res.status(403).json({ error: 'Not authorized' });
    await trade.deleteOne();
    res.json({ message: 'Trade deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

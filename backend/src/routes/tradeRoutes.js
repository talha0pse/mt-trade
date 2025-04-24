// backend/src/routes/tradeRoutes.js
const express = require('express');
const auth    = require('../middleware/authMiddleware');
const Trade   = require('../models/Trade');
const router  = express.Router();

// List trades
router.get('/', async (req, res) => {
  const trades = await Trade.find().sort({ createdAt: -1 });
  res.json(trades);
});

// Create trade (buy/sell)
router.post('/', auth, async (req, res) => {
  const { symbol, action, price } = req.body;
  if (!symbol||!action||!price) return res.status(400).json({ error: 'Missing' });
  const t = await Trade.create({ symbol, action, price, userId: req.userId });
  res.status(201).json(t);
});

// Update trade
router.put('/:id', auth, async (req, res) => {
  const t = await Trade.findById(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (t.userId.toString()!==req.userId) return res.status(403).json({ error: 'Forbidden' });
  Object.assign(t, req.body);
  await t.save();
  res.json({ message: 'Updated', trade: t });
});

// Delete trade
router.delete('/:id', auth, async (req, res) => {
  const t = await Trade.findById(req.params.id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (t.userId.toString()!==req.userId) return res.status(403).json({ error: 'Forbidden' });
  await t.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;
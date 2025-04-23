const express = require('express');
const router = express.Router();
const { createTrade, getTrades, deleteTrade, updateTrade } = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getTrades);
router.post('/', authMiddleware, createTrade);
router.delete('/:id', authMiddleware, deleteTrade);
router.put('/:id', authMiddleware, updateTrade);

module.exports = router;

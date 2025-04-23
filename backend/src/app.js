const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

module.exports = app;

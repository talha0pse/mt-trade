// backend/src/server.js
require('dotenv').config();
require('../instrument');           // initializes Sentry

const express = require('express');
const Sentry  = require('@sentry/node');
const app     = express();

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

app.get('/debug-sentry', (req, res) => {
  throw new Error('Sentry OK');
});

app.use(Sentry.Handlers.errorHandler());

const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));

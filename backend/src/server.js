// backend/src/server.js

// 1. Load .env and Sentry instrumentation FIRST
require('dotenv').config();
require('../instrument');            // runs Sentry.init() before Express

const express = require('express');
const Sentry  = require('@sentry/node'); // the same Sentry instance

const app = express();

// 2. Your middleware and routes
app.use(express.json());
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));



// 3. Add Sentry’s Express error handler *after* all routes
Sentry.setupExpressErrorHandler(app);  // replaces manual request/tracing handlers :contentReference[oaicite:3]{index=3}

// 4. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

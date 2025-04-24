// backend/src/server.js

// 1. Import Sentry initialization FIRST
require('../instrument'); // Make sure this path is correct

const express = require('express');
const Sentry = require('@sentry/node'); // Import once here
const app = express();

// 2. Attach Sentry middleware BEFORE your routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 3. Your application routes
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 4. Sentry error handler AFTER your routes
app.use(Sentry.Handlers.errorHandler());

// 5. MongoDB connection and server start
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

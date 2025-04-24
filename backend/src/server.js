// backend/src/server.js

// 1. Load environment variables and initialize Sentry
require('dotenv').config();
require('../instrument');  // Must run before anything else

const express = require('express');
const Sentry = require('@sentry/node'); // same instance as instrument.js

const app = express();

// 2. Add Sentry's request and tracing middleware before your routes
app.use(Sentry.Handlers.requestHandler());   // Captures request info
app.use(Sentry.Handlers.tracingHandler());   // Captures performance info

// 3. Your normal app routes
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 4. Debug route to test error reporting
app.get('/debug-sentry', (req, res) => {
  throw new Error('Sentry OK'); // This should appear in your Sentry dashboard
});

// 5. Add Sentry error handler after all routes
app.use(Sentry.Handlers.errorHandler());     // Captures uncaught errors

// 6. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

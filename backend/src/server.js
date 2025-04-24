// backend/src/server.js

// 1. Load environment vars first
require('dotenv').config();

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const express = require('express');

// 2. Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, // capture 100% of transactions (tune down in prod)
});

const app = require('./app'); // your Express app: routes + middleware

// 3. Add Sentry request & tracing handlers BEFORE all routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 4. (Routes are registered inside app.js)

// 5. Add Sentry error handler AFTER all routes
app.use(Sentry.Handlers.errorHandler());

// 6. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

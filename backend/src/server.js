// backend/src/server.js
require('dotenv').config();

const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

// 1. Create your Express app first
const app = express();

// 2. Initialize Sentry WITH the Express integration
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // Capture HTTP calls (outgoing)
    new Sentry.Integrations.Http({ tracing: true }),
    // Attach to your Express app for incoming requests
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0, // adjust in prod
});

// 3. Add Sentry middleware BEFORE your routes
app.use(Sentry.Handlers.requestHandler());  // start request capture
app.use(Sentry.Handlers.tracingHandler());  // start performance monitoring

// 4. Import routes and other middleware from app.js (if you split them)
require('./app')(app);  // assume app.js exports a function that sets up routes

// 5. Add the error handler as the last middleware
app.use(Sentry.Handlers.errorHandler());

// 6. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

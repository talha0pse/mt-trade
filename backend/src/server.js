// backend/src/server.js

// 1. Load environment variables first
require('dotenv').config();

const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const app = express();

// 2. Initialize Sentry with HTTP & Express tracing integrations
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // Captures outgoing HTTP requests & breadcrumbs
    new Sentry.Integrations.Http({ tracing: true }),
    // Instruments incoming Express requests
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0, // adjust down (e.g. 0.2) in production
});

// 3. Request handler must come before your routes
app.use(Sentry.Handlers.requestHandler());
// 4. Tracing handler to capture performance
app.use(Sentry.Handlers.tracingHandler());

// 5. Add your JSON/body middleware and routes
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 6. Error handler must come after all routes
app.use(Sentry.Handlers.errorHandler());

// 7. Connect to MongoDB and start server
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

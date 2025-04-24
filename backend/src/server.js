// backend/src/server.js

// 1. Load environment variables first
require('dotenv').config();

const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const app = express();

// 2. Initialize Sentry with correct integrations
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // Outgoing HTTP spans & breadcrumbs
    Sentry.httpIntegration(),                     
    // Incoming request tracing for Express
    new Tracing.Integrations.Express({ app }),     
  ],
  tracesSampleRate: 1.0, // adjust (e.g., 0.2) in production
});

// 3. Sentry Request & Tracing Handlers
app.use(Sentry.Handlers.requestHandler());         // starts context
app.use(Sentry.Handlers.tracingHandler());         // starts perf monitoring

// 4. Your app’s JSON/body parser and routes
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 5. Sentry Error Handler (last)
app.use(Sentry.Handlers.errorHandler());

// 6. Connect to MongoDB and launch
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

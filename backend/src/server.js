// backend/src/server.js

// 1. Load environment variables and initialize Sentry BEFORE anything else
require('dotenv').config();
const Sentry = require('@sentry/node');

// 2. Initialize Sentry with its default integrations (HTTP, Express, etc.)
//    and enable performance tracing by setting tracesSampleRate.
//    We do NOT override `integrations` or disable defaults.
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,               // 100% sampling for testing; lower in prod :contentReference[oaicite:0]{index=0}
  // Note: No `integrations` or `defaultIntegrations` settings here—let Sentry do its thing.
});

// 3. Now import and create your Express app
const express = require('express');
const app     = express();

// 4. Sentry middleware (must come before your routes)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler()); // performance tracing :contentReference[oaicite:1]{index=1}

// 5. Your normal middleware & routes
app.use(express.json());
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 6. Sentry error handler (last middleware)
app.use(Sentry.Handlers.errorHandler());

// 7. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

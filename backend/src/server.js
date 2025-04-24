// backend/src/server.js

// 1. Load env vars and Sentry BEFORE requiring express
require('dotenv').config();

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

// 2. Initialize Sentry – BEFORE express is imported!
//    - Turn off all default integrations to avoid broken hooks
//    - Explicitly add only the HTTP & Express integrations you need
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  defaultIntegrations: false,    // disable all auto-enabled SDK integrations :contentReference[oaicite:1]{index=1}
  integrations: [
    Sentry.httpIntegration(),     // outgoing HTTP spans & breadcrumbs :contentReference[oaicite:2]{index=2}
    new Tracing.Integrations.Express({ app: undefined }), // placeholder, patched below
  ],
  tracesSampleRate: 1.0,          // full performance sampling for testing
});

// 3. Now import Express & create the app
const express = require('express');
const app = express();

// 4. Patch the Express integration to receive the real app reference
//    (workaround because we had to init before express import)
const expressIntegration = Sentry.getCurrentHub()
  .getClient()
  .getIntegrations()
  .find(i => i.name === 'Express');
if (expressIntegration) {
  expressIntegration._module.handler = app; // internal hook setup
}

// 5. Sentry request + tracing middleware (in this order!)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 6. Your routes & middleware
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 7. Sentry error handler (last)
app.use(Sentry.Handlers.errorHandler());

// 8. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

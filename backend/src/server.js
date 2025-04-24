// backend/src/server.js

// 1. Load environment vars & initialize Sentry BEFORE express import
require('dotenv').config();
const Sentry = require('@sentry/node');                   // Error reporting SDK
const { Integrations } = require('@sentry/tracing');      // Tracing integrations

// 2. Create your Express app first
const express = require('express');
const app     = express();

// 3. Initialize Sentry with **only** the integrations we need
Sentry.init({
  dsn: process.env.SENTRY_DSN,                            // your DSN from Sentry UI
  defaultIntegrations: false,                             // disable auto-enabled integrations
  integrations: [
    Sentry.httpIntegration(),                             // outgoing HTTP spans & breadcrumbs :contentReference[oaicite:4]{index=4}
    new Integrations.Express({ app }),                    // incoming Express request tracing :contentReference[oaicite:5]{index=5}
  ],
  tracesSampleRate: 1.0,                                  // 100% sampling for performance testing :contentReference[oaicite:6]{index=6}
});

// 4. Sentry middleware must wrap your routes
app.use(Sentry.Handlers.requestHandler());                // start request context
app.use(Sentry.Handlers.tracingHandler());                // start performance tracing

// 5. Your regular middleware & routes
app.use(express.json());
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 6. Sentry error handler (last middleware)
app.use(Sentry.Handlers.errorHandler());

// 7. Connect to MongoDB and launch the server
const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

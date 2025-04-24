// backend/instrument.js

// 1. Load environment variables so process.env.SENTRY_DSN is set
require('dotenv').config();

// 2. Import Sentry and initialize it
const Sentry = require('@sentry/node');

// 3. Initialize Sentry with DSN and enable performance tracing
Sentry.init({
  dsn: process.env.SENTRY_DSN,      // your Sentry DSN from Client Keys :contentReference[oaicite:0]{index=0}
  tracesSampleRate: 1.0,            // 100% sampling for testing; lower in production :contentReference[oaicite:1]{index=1}
});

// 4. (Optional) export Sentry for use elsewhere
module.exports = Sentry;

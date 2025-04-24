// backend/instrument.js

// 1. Load env vars so process.env.SENTRY_DSN is available
require('dotenv').config();

// 2. Import & initialize Sentry **before** any other modules
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: process.env.SENTRY_DSN,       // your DSN from Sentry UI :contentReference[oaicite:1]{index=1}
  tracesSampleRate: 1.0,             // capture all transactions for now :contentReference[oaicite:2]{index=2}
});

// 3. (Optional) You can export Sentry if you need to use it elsewhere:
module.exports = Sentry;

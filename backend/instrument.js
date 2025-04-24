// backend/instrument.js
// Load environment variables early
require('dotenv').config();

// Initialize Sentry for error & performance monitoring
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN,      // your real DSN here
  tracesSampleRate: 1.0,            // 100% sampling (tune for prod)
});
module.exports = Sentry;

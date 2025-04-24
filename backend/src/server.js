// backend/src/server.js

// 1. Load environment variables and initialize Sentry
require('dotenv').config();
require('../instrument');            // runs Sentry.init() before Express

const express = require('express');
const cors    = require('cors');
const Sentry  = require('@sentry/node');

const app = express();

// 2. Enable CORS for your React app
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// 3. Attach Sentry middleware before all routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 4. Parse JSON bodies
app.use(express.json());

// 5. Root health check
app.get('/', (req, res) => {
  res.status(200).send('Backend is working!');
});

// 6. Debug route to test Sentry
app.get('/debug-sentry', (req, res) => {
  throw new Error('Sentry OK');
});

// 7. Your API routes
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 8. Sentry error handler (must come last)
app.use(Sentry.Handlers.errorHandler());

// 9. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;

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

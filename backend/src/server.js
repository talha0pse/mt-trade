// backend/src/server.js

// 1. Load environment variables and Sentry first
require('dotenv').config();
require('../instrument');            // initializes Sentry

const express = require('express');
const cors    = require('cors');
const Sentry = require('@sentry/node');

const app = express();

// 2. Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',   // allow your React app :contentReference[oaicite:3]{index=3}
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,                 // allow cookies/auth headers if needed :contentReference[oaicite:4]{index=4}
}));

// 3. Attach Sentry middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 4. Your normal middleware & routes
app.use(express.json());
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 5. Debug route to test Sentry
app.get('/debug-sentry', (req, res) => {
  throw new Error('Sentry OK');
});

// 6. Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// 7. Connect to MongoDB and start the server
const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));

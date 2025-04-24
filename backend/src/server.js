// backend/src/server.js

// 1. Load environment variables and initialize Sentry
require('dotenv').config();
require('../instrument'); // runs Sentry.init()

const express = require('express');
const cors    = require('cors');
const Sentry  = require('@sentry/node');
const mongoose= require('mongoose');

const authRoutes  = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// 2. Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// 3. Sentry request & tracing handlers
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 4. Body parser
app.use(express.json());

// 5. Health check
app.get('/', (req, res) => res.status(200).send('Backend is working!'));

// 6. Debug route
app.get('/debug-sentry', (req, res, next) => {
  // This error will be captured by Sentry
  next(new Error('Sentry OK'));
});

// 7. Mount your API routes
app.use('/api/auth',  authRoutes);
app.use('/api/trades', tradeRoutes);

// 8. Sentry error handler (captures & reports errors)
app.use(Sentry.Handlers.errorHandler());

// 9. Final Express error handler (returns JSON)
//    This prevents blank 500 pages and handles all errors uniformly.
app.use((err, req, res, next) => {
  console.error(err); // still log to console
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 10. Connect to MongoDB & start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error('❌ MongoDB connection error:', err));

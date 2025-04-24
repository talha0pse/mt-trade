// backend/src/server.js

// 1. Load env & Sentry
require('dotenv').config();
require('../instrument');

const express = require('express');
const cors    = require('cors');
const Sentry  = require('@sentry/node');
const mongoose= require('mongoose');

const authRoutes  = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// 2. CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// 3. Sentry middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 4. JSON body parsing
app.use(express.json());

// 5. Health check
app.get('/', (req, res) => res.send('Backend is working!'));

// 6. Debug Sentry
app.get('/debug-sentry', (req, res, next) => next(new Error('Sentry OK')));

// 7. Mount routes
app.use('/api/auth',  authRoutes);
app.use('/api/trades', tradeRoutes);

// 8. Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// 9. Connect & start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT||5000, () => console.log('🚀 Server running'));
})
.catch(err => console.error('❌ MongoDB error:', err));

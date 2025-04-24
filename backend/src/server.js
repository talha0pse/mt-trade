// backend/src/server.js
require('dotenv').config();
require('../instrument'); // initializes Sentry first

const express = require('express');
const cors    = require('cors');
const Sentry  = require('@sentry/node');
const mongoose= require('mongoose');

const authRoutes  = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// CORS to allow React dev at localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Sentry request & tracing handlers
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// JSON body parser
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Backend is working!'));

// Debug route for Sentry
app.get('/debug-sentry', (req, res, next) => {
  next(new Error('Sentry OK')); // passes to error handler :contentReference[oaicite:4]{index=4}
});

// Mount API routes
app.use('/api/auth',  authRoutes);
app.use('/api/trades', tradeRoutes);

// Sentry error handler (last middleware)
app.use(Sentry.Handlers.errorHandler());

// Connect to MongoDB & start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT||5000, () => console.log('🚀 Server running'));
})
.catch(err => console.error('❌ MongoDB connection error:', err));

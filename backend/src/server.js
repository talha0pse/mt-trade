require('dotenv').config();            // 1. Load .env into process.env

const express    = require('express');
const cors       = require('cors');
const mongoose   = require('mongoose');

const authRoutes  = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');

const app = express();

// 2. CORS: only allow our React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// 3. JSON parser
app.use(express.json());

// 4. Health check
app.get('/', (req, res) => {
  res.status(200).send('Backend is working!');
});

// 5. Debug endpoint
app.get('/debug-error', (req, res, next) => {
  next(new Error('Debug Error Triggered'));
});

// 6. Mount routes
app.use('/api/auth',  authRoutes);
app.use('/api/trades', tradeRoutes);

// 7. Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 8. Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

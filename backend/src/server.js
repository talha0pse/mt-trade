// backend/src/server.js

// 1. Import the auto-generated Sentry config first
require('../instrument');   // ← this is the wizard-generated file

// 2. Now import Express and the rest
const express = require('express');
const app     = express();

// 3. (No need to manually call requestHandler() or errorHandler())
//    The wizard’s file already patched in the correct middleware.

app.use(express.json());
app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// 4. Finally, start your server as before
const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// src/app.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const emailRoutes = require('./src/routes/email.routes');
const mediaRoutes = require('./src/routes/media.routes');
const renderEJSRoutes = require('./src/routes/renderEJS.routes');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
console.log(process.env.MONGODB_URI);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true,})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

  
app.use('/api/email', emailRoutes);
app.use('/api/media',mediaRoutes);
app.use('/api/renderEJS', renderEJSRoutes);

  // Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
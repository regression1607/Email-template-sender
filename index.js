// src/app.js
const express = require('express');
const emailRoutes = require('./src/routes/email.routes');

const app = express();
app.use(express.json());


// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
  
  app.use('/api/email', emailRoutes);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
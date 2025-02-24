// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const emailRateLimiter = rateLimit({
  windowMs: 0 * 1 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many email requests, please try again later.'
  }
});

module.exports = emailRateLimiter;

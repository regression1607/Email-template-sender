// src/routes/email.routes.js
const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email.controller');
const { emailValidationRules, validate } = require('../validators/email.validator');
const emailRateLimiter = require('../middleware/rateLimiter');

router.post(
  '/send',
  emailRateLimiter,
  emailValidationRules(),
  validate,
  EmailController.sendEmail
);

module.exports = router;
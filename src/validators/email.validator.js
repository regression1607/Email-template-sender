// src/validators/email.validator.js
const { body, validationResult } = require('express-validator');

const emailValidationRules = () => {
  return [
    body('to')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    
    body('subject')
      .trim()
      .notEmpty()
      .withMessage('Subject cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Subject cannot exceed 100 characters'),
    
    // body('templateName')
    //   .trim()
    //   .notEmpty()
    //   .withMessage('Template name cannot be empty')
    //   .custom((value) => {
    //     const templatePath = path.join(__dirname, '../templates', `${value}.html`);
    //     return fs.existsSync(templatePath);
    //   })
    //   .withMessage('Template does not exist'),
    
    // Optional CC and BCC validation
    body('cc')
      .optional()
      .isArray()
      .withMessage('CC must be an array')
      .custom((value) => {
        if (value && value.length > 0) {
          return value.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        }
        return true;
      })
      .withMessage('Invalid CC email address(es)'),
    
    body('bcc')
      .optional()
      .isArray()
      .withMessage('BCC must be an array')
      .custom((value) => {
        if (value && value.length > 0) {
          return value.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        }
        return true;
      })
      .withMessage('Invalid BCC email address(es)')
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  emailValidationRules,
  validate
};
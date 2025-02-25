const { body, param, query } = require('express-validator');
const validationMiddleware = require('../middleware/validation.middleware');

const mediaTypeValidator = {
  image: [
    body('mediatype')
      .isIn(['avatar', 'Post', 'Feed', 'Profile', 'Misc'])
      .withMessage('Invalid mediatype for image'),
    body('resource')
      .isIn(['post', 'feed', 'profile', 'misc', 'flags', 'icons'])
      .withMessage('Invalid resource for image')
  ],
  
  video: [
    body('mediatype')
      .isIn(['Post', 'Feed', 'Misc'])
      .withMessage('Invalid mediatype for video'),
    body('resource')
      .isIn(['post', 'feed', 'misc'])
      .withMessage('Invalid resource for video')
  ],
  
  audio: [
    body('mediatype')
      .isIn(['Post', 'Feed', 'Misc'])
      .withMessage('Invalid mediatype for audio'),
    body('resource')
      .isIn(['post', 'feed', 'misc'])
      .withMessage('Invalid resource for audio')
  ],
  
  document: [
    body('mediatype')
      .isIn(['UserDocument', 'Misc'])
      .withMessage('Invalid mediatype for document'),
    body('resource')
      .isIn(['documents', 'misc'])
      .withMessage('Invalid resource for document')
  ]
};

const commonValidators = [
  body('owner').notEmpty().withMessage('Owner is required'),
  body('title').optional(),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  body('uploadedBy').notEmpty().withMessage('UploadedBy is required'),
  body('forPlatform').optional().isIn(['web', 'mobile', 'desktop']).withMessage('Invalid platform'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean')
];

// Helper function to combine common and specific validators
const combineValidators = (type) => {
  return [
    ...commonValidators,
    ...mediaTypeValidator[type],
    (req, res, next) => {
      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      next();
    },
    validationMiddleware
  ];
};

module.exports = {
  uploadImage: combineValidators('image'),
  uploadVideo: combineValidators('video'),
  uploadAudio: combineValidators('audio'),
  uploadDocument: combineValidators('document'),
  
  deleteMedia: [
    param('id').isMongoId().withMessage('Invalid media ID'),
    validationMiddleware
  ],
  
  getMediaByOwner: [
    param('owner').notEmpty().withMessage('Owner is required'),
    query('type').optional().isIn(['image', 'video', 'audio', 'document']).withMessage('Invalid media type'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    validationMiddleware
  ]
};
const express = require('express');
const router = express.Router();
const MediaController = require('../controllers/media.controller');
const MediaValidator = require('../validators/media.validator');
const upload = require('../middleware/multer.middleware');

router.post(
    '/upload/images',
    upload.single('file'),
    MediaValidator.uploadImage,
    MediaController.uploadImage
  );
  
  router.post(
    '/upload/videos',
    upload.single('file'),
    MediaValidator.uploadVideo,
    MediaController.uploadVideo
  );
  
  router.post(
    '/upload/audios',
    upload.single('file'),
    MediaValidator.uploadAudio,
    MediaController.uploadAudio
  );
  
  router.post(
    '/upload/documents',
    upload.single('file'),
    MediaValidator.uploadDocument,
    MediaController.uploadDocument
  );

  router.get(
    '/owner/:owner',
    MediaValidator.getMediaByOwner,
    MediaController.getMediaByOwner
  );
  

module.exports = router;
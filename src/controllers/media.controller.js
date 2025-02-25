const MediaService = require('../services/media.service');

class MediaController {
  async uploadImage(req, res) {
    try {
      const userData = {
        ...req.body,
        type: 'image'
      };
      
      const media = await MediaService.uploadMedia(req.file, userData);
      
      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: media
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  async uploadVideo(req, res) {
    try {
      const userData = {
        ...req.body,
        type: 'video'
      };
      
      const media = await MediaService.uploadMedia(req.file, userData);
      
      res.status(201).json({
        success: true,
        message: 'Video uploaded successfully',
        data: media
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  async uploadAudio(req, res) {
    try {
      const userData = {
        ...req.body,
        type: 'audio'
      };
      
      const media = await MediaService.uploadMedia(req.file, userData);
      
      res.status(201).json({
        success: true,
        message: 'Audio uploaded successfully',
        data: media
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  async uploadDocument(req, res) {
    try {
      const userData = {
        ...req.body,
        type: 'document'
      };
      
      const media = await MediaService.uploadMedia(req.file, userData);
      
      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: media
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  async deleteMedia(req, res) {
    try {
      const { id } = req.params;
      
      const result = await MediaService.deleteMedia(id);
      
      res.status(200).json({
        success: true,
        message: 'Media deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  async getMediaByOwner(req, res) {
    try {
      const { owner } = req.params;
      const { type, page = 1, limit = 10 } = req.query;
      
      const result = await MediaService.getMediaByOwner(owner, type, parseInt(limit), parseInt(page));
      
      res.status(200).json({
        success: true,
        data: result.media,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new MediaController();
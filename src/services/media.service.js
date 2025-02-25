// services/media.service.js
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const MediaManager = require('../models/MediaManager');

class MediaService {
  constructor() {
    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    
    this.s3 = new AWS.S3();
    this.bucket = process.env.AWS_S3_BUCKET;
    
    // Define allowed extensions for each media type
    this.allowedExtensions = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      video: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
      audio: ['mp3', 'wav', 'ogg', 'm4a'],
      document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
    };
    
    // Define file size limits in bytes
    this.fileSizeLimits = {
      image: 5 * 1024 * 1024, // 5MB
      video: 50 * 1024 * 1024, // 50MB
      audio: 10 * 1024 * 1024, // 10MB
      document: 20 * 1024 * 1024 // 20MB
    };
  }

  /**
   * Get the S3 key based on the file metadata
   */
  getS3Key(fileInfo) {
    const { owner, resource, mediatype, filename } = fileInfo;
    
    // Format date for path
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Check if the file is an avatar
    if (mediatype === 'avatar') {
      return `platform/media/${owner}/avatar/${filename}`;
    }
    
    // For all other file types
    return `platform/media/${resource}/${mediatype}/${year}/${month}/${day}/${filename}`;
  }

  /**
   * Validate file before upload
   */
  validateFile(file, mediaType, resource) {
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Check file extension
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (!this.allowedExtensions[mediaType].includes(extension)) {
      throw new Error(`Invalid file extension for ${mediaType}. Allowed: ${this.allowedExtensions[mediaType].join(', ')}`);
    }
    
    // Check file size
    if (file.size > this.fileSizeLimits[mediaType]) {
      const maxSizeMB = this.fileSizeLimits[mediaType] / (1024 * 1024);
      throw new Error(`File size exceeds the limit of ${maxSizeMB}MB for ${mediaType}`);
    }
    
    // Check if resource is valid
    const validResources = ['post', 'feed', 'profile', 'documents', 'misc', 'flags', 'icons'];
    if (!validResources.includes(resource)) {
      throw new Error(`Invalid resource type. Allowed: ${validResources.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Upload file to S3
   */
  async uploadToS3(file, key) {
    const fileContent = fs.readFileSync(file.path);
    
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: fileContent,
      ContentType: file.mimetype,
      ACL: 'public-read' // Make the file publicly readable
    };
    
    try {
      const uploaded = await this.s3.upload(params).promise();
      return uploaded.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3');
    } finally {
      // Clean up the temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }

  /**
   * Upload media and save record to database
   */
  async uploadMedia(file, userData) {
    try {
      const { 
        owner, 
        mediatype, 
        type, 
        resource, 
        title = '', 
        metadata = {}, 
        uploadedBy, 
        forPlatform = 'web', 
        isPublic = false 
      } = userData;
      
      // Validate the file
      this.validateFile(file, type, resource);
      
      // Generate a unique filename
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop().toLowerCase();
      const filename = `${timestamp}-${file.originalname.replace(/\s+/g, '-')}`;
      
      // Get S3 key
      const fileInfo = { owner, resource, mediatype, filename };
      const key = this.getS3Key(fileInfo);
      
      // Upload file to S3
      const url = await this.uploadToS3(file, key);
      
      // Create media record
      const mediaRecord = new MediaManager({
        owner,
        filename,
        storage: 's3',
        mediatype,
        type,
        sizeInBytes: file.size,
        extension,
        url,
        resource,
        metadata,
        title,
        uploadedBy,
        forPlatform,
        isPublic
      });
      
      // Save to database
      await mediaRecord.save();
      
      return mediaRecord;
    } catch (error) {
      throw error;
    }
  }

//   /**
//    * Delete media from S3 and database
//    */
//   async deleteMedia(mediaId) {
//     try {
//       const media = await MediaManager.findById(mediaId);
//       if (!media) {
//         throw new Error('Media not found');
//       }
      
//       // Delete from S3
//       const key = this.getS3Key({
//         owner: media.owner,
//         resource: media.resource,
//         mediatype: media.mediatype,
//         filename: media.filename
//       });
      
//       await this.s3.deleteObject({
//         Bucket: this.bucket,
//         Key: key
//       }).promise();
      
//       // Delete from database
//       await MediaManager.findByIdAndDelete(mediaId);
      
//       return { success: true, message: 'Media deleted successfully' };
//     } catch (error) {
//       throw error;
//     }
//   }

  /**
   * Get media by owner
   */
  async getMediaByOwner(owner, type = null, limit = 10, page = 1) {
    try {
      const query = { owner };
      if (type) {
        query.type = type;
      }
      
      const skip = (page - 1) * limit;
      
      const media = await MediaManager.find(query)
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await MediaManager.countDocuments(query);
      
      return {
        media,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MediaService();

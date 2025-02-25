import mongoose from 'mongoose';

const mediaSchema  = new mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  storage: {
    type: String,
    required: true
  },
  mediatype: {
    type: String,
    enum: ['avatar', 'UserDocument', 'Post', 'Feed', 'Profile', 'Misc'],
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'document'],
    required: true
  },
  sizeInBytes: {
    type: Number,
    required: true
  },
  extension: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    enum: ['post', 'feed', 'profile', 'documents', 'misc', 'flags', 'icons'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  title: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: String,
    required: true
  },
  forPlatform: {
    type: String,
    enum: ['web', 'mobile'],
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: false
  }
});

// Add indexes for common queries
mediaManagerSchema.index({ owner: 1 });
mediaManagerSchema.index({ type: 1 });
mediaManagerSchema.index({ mediatype: 1 });
mediaManagerSchema.index({ resource: 1 });
mediaManagerSchema.index({ uploadedAt: -1 });

export default mongoose.model('Media', mediaSchema);

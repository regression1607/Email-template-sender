// validators/image.validator.js
import Validator from 'fastest-validator';

const v = new Validator();

const imageSchema = {
  owner: { type: "string", optional: false },
  resource: { 
    type: "enum", 
    values: ["post", "feed", "profile", "documents", "misc", "flags", "icons"],
    optional: false
  },
  mediatype: { 
    type: "enum", 
    values: ["avatar", "UserDocument", "Post", "Feed", "Profile", "Misc"],
    optional: false
  },
  title: { type: "string", optional: true },
  metadata: { type: "object", optional: true },
  forPlatform: { type: "string", optional: true },
  isPublic: { type: "boolean", optional: true },
  $$strict: true // no additional properties allowed
};

export const validateImageUpload = v.compile(imageSchema);

export const validateFileType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!file || !allowedTypes.includes(file.mimetype)) {
    return { valid: false, message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` };
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, message: `File too large. Maximum size is 5MB` };
  }
  
  return { valid: true };
};
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';

/**
 * Factory function to create a Multer middleware with Cloudinary storage.
 * @param {string} folder - The Cloudinary folder where files will be uploaded.
 * @returns {multer.Multer} - Configured Multer middleware.
 */
const createUploadMiddleware = (folder) => {
  // Configure Cloudinary Storage with dynamic folder
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `kantan_lunch/${folder}`, // Dynamic folder based on parameter
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Include other formats if needed
      transformation: [{ width: 800, height: 600, crop: 'limit' }], // Optional: image transformations
    },
  });

  // Initialize Multer with Cloudinary Storage
  return multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.'));
      }
    },
  });
};

export default createUploadMiddleware;

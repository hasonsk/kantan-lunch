import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';
import crypto from 'crypto';
import FileHash from '../models/fileHashModel.js';

const createUploadMiddleware = ({ field = 'media', folder = 'uploads', multiple = false, maxFiles = 5 } = {}) => {
  // Use memory storage first to access file buffer
  const memStorage = multer.memoryStorage();
  const upload = multer({
    storage: memStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      cb(null, allowed.includes(file.mimetype));
    }
  });

  // Upload to Cloudinary using file buffer
  const uploadToCloudinary = async (req, res, next) => {
    try {
      const files = req[multiple ? 'files' : 'file'];
      if (!files) return next();

      const fileList = Array.isArray(files) ? files : [files];
      const mediaUrls = await Promise.all(fileList.map(async file => {
        const hash = crypto
          .createHash('md5')
          .update(file.buffer)
          .digest('hex');

        const existing = await FileHash.findOne({ hash });
        if (existing) return existing.url;

        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          { folder: `kantan_lunch/${folder}` }
        );

        await FileHash.create({ hash, url: result.secure_url });
        return result.secure_url;
      }));

      req.mediaUrls = mediaUrls;
      next();
    } catch (err) {
      next(err);
    }
  };

  return [
    upload[multiple ? 'array' : 'single'](field, maxFiles),
    uploadToCloudinary
  ];
};

export default createUploadMiddleware;
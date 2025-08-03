import multer from 'multer';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: 'node-boilerplate',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

export const cloudinaryUpload = multer({ storage });

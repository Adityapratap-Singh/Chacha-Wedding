
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { logAction } = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wedding_invitation',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }],
  },
});

const upload = multer({ storage: storage });

exports.uploadImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      // Log the upload
      await logAction(
        req.user ? req.user.email : 'System',
        'UPLOAD_IMAGE',
        'Cloudinary',
        { url: req.file.path, public_id: req.file.filename, originalName: req.file.originalname },
        req.ip
      );

      res.json({ url: req.file.path, public_id: req.file.filename });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
];

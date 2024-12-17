import express from 'express';

import {
  deletePropertyImage,
  imageUpload,
  uploadMultiplePropertyImages,
} from '../controllers/imageController';
import { adminMiddleware, userMiddleware } from '@middleware/protect/protect';
import upload from '@middleware/fileUpload/multer';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', userMiddleware, upload.single('image'), imageUpload);
router.post(
  '/properties/upload-multiple',
  adminMiddleware,
  upload.array('images', 10), // Limit the number of images if needed
  (req, res, next) => {

    if (!req.body.propertyId) {
      return res.status(400).json({ message: 'Property id is required' });
    }
    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one image is required.' });
    }
    next();
  },
  uploadMultiplePropertyImages
);
router.delete(
  '/properties/:id/images/:publicId(*)',
  adminMiddleware,
  deletePropertyImage
);

export default router;

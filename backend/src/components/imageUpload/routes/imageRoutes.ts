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
    console.log('Request Body:', req.body); // Should include propertyId
    if (!req.body.propertyId) {
      return res.status(400).json({ message: 'Property id is required' });
    }
    next();
  },
  uploadMultiplePropertyImages
);
router.delete(
  '/properties/:id/images/:publicId',
  adminMiddleware,deletePropertyImage
);

export default router;

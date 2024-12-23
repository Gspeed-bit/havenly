import express from 'express';

import {
  deletePropertyImage,
  imageUpload,
  uploadMultiplePropertyImages,
} from '../controllers/imageController';
import {
  adminMiddleware,
  userMiddleware,
} from '@middleware/userAndAdminMiddleware/protect';
import upload from '@middleware/fileUpload/multer';

const router = express.Router();

// POST endpoint for image upload

// Route accessible to both users and admins
router.post('/upload', userMiddleware, upload.single('image'), imageUpload);


// Admin-only route
router.post(
  '/properties/upload-multiple',userMiddleware,
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
// Admin-only route
router.delete(
  '/properties/:id/images/:publicId(*)',userMiddleware,
  adminMiddleware,
  deletePropertyImage
);

export default router;

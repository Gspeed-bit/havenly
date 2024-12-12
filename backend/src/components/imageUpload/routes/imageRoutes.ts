import express from 'express';

import {
  deletePropertyImage,
  imageUpload,
} from '../controllers/imageController';
import { userMiddleware } from '@middleware/protect/protect';
import upload from '@middleware/fileUpload/multer';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', userMiddleware, upload.single('image'), imageUpload);
router.delete('/properties/:id/images/:publicId', deletePropertyImage);

export default router;

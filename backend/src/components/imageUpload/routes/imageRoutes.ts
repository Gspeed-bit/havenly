import express from 'express';

import upload from '@middleware/fileUpload/multer';
import { imageUpload } from '../controllers/imageController';
import { adminMiddleware, userMiddleware } from '@middleware/protect/protect';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', adminMiddleware, userMiddleware, upload.single('image'), imageUpload);

export default router;

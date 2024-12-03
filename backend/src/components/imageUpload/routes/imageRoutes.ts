import express from 'express';

import upload from '@middleware/fileUpload/multer';
import { imageUpload } from '../controllers/imageController';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', upload.single('image'), imageUpload);

export default router;

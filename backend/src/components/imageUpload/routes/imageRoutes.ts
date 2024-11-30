import express from 'express';
import { uploadUserImage } from '../controllers/imageController';
import upload from '@middleware/fileUpload/multer';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', upload.single('image'), uploadUserImage);

export default router;

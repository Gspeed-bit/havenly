import express from 'express';
import { imageUpload } from '../controllers/image';
import upload from '@middleware/fileUpload/multer';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', upload.single('image'), imageUpload);

export default router;

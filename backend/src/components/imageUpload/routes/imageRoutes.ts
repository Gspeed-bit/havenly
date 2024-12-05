import express from 'express';

import { imageUpload } from '../controllers/imageController';
import {  userMiddleware } from '@middleware/protect/protect';
import upload from '@middleware/fileUpload/multer';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', userMiddleware, upload.single('image'), imageUpload);


export default router;

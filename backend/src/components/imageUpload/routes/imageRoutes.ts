import express from 'express';

import { imageUpload } from '../controllers/imageController';
import {  userMiddleware } from '@middleware/protect/protect';

const router = express.Router();

// POST endpoint for image upload
router.post('/upload', userMiddleware, imageUpload);

export default router;

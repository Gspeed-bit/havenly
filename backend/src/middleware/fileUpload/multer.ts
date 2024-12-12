import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory for immediate Cloudinary upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});


export default upload;

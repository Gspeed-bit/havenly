import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory for immediate Cloudinary upload
const upload = multer({ storage }).single('imgUrl');  // 'imgUrl' is the field name for image in form-data


export default upload;

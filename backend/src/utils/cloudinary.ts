import { v2 as cloudinary } from 'cloudinary';
import { KEYS } from 'config/config';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: KEYS.cloudName,
  api_key: KEYS.apiKey,
  api_secret: KEYS.apiSecret,
});

export default cloudinary;

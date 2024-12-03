import { v2 as cloudinary } from 'cloudinary';
import { KEYS } from 'config/config';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: KEYS.cloudName,
  api_key: KEYS.apiKey,
  api_secret: KEYS.apiSecret,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
): Promise<{ secureUrl: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('No result from Cloudinary'));
        resolve({ secureUrl: result.secure_url, publicId: result.public_id });
      })
      .end(fileBuffer);
  });
};

export default cloudinary;

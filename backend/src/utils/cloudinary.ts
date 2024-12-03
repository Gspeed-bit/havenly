import { v2 as cloudinary } from 'cloudinary';
import { KEYS } from 'config/config';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: KEYS.cloudName,
  api_key: KEYS.apiKey,
  api_secret: KEYS.apiSecret,
});

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    console.log("Uploading image to folder:", folder); // Debugging line

    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: 'image' }, // Ensure this is the correct parameter for folder
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error); // Log the error for debugging
            return reject(error);
          }
          if (!result) {
            return reject(new Error('No result from Cloudinary.'));
          }
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      )
      .end(fileBuffer);
  });
};
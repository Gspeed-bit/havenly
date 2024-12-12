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
  fileBuffers: Buffer | Buffer[], // Accept both single and array of buffers
  folder: string
): Promise<
  | { secure_url: string; public_id: string }
  | { secure_url: string; public_id: string }[]
> => {
  // If a single file is passed, convert it into an array
  const buffers = Array.isArray(fileBuffers) ? fileBuffers : [fileBuffers];

  // Return an array of promises to handle multiple uploads concurrently
  const uploadPromises = buffers.map((fileBuffer) => {
    return new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                return reject(error);
              }
              if (!result) {
                return reject(new Error('No result from Cloudinary.'));
              }
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            }
          )
          .end(fileBuffer);
      }
    );
  });

  // Wait for all uploads to finish and return the results
  return Promise.all(uploadPromises);
};
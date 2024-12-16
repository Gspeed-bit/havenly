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
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
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
      })
      .end(fileBuffer);
  });
};


// Multiple file upload function
export const uploadImagesToCloudinary = async (
  filesBuffer: Buffer[],
  folder: string
): Promise<{ secure_url: string; public_id: string }[]> => {
  return new Promise((resolve, reject) => {
    const uploadedImages: { secure_url: string; public_id: string }[] = [];

    // Iterate over each file and upload
    let uploadCount = 0;

    filesBuffer.forEach((fileBuffer) => {
      cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }

          if (result) {
            uploadedImages.push({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }

          uploadCount++;

          // Resolve when all images are uploaded
          if (uploadCount === filesBuffer.length) {
            resolve(uploadedImages);
          }
        }
      ).end(fileBuffer);
    });
  });
};
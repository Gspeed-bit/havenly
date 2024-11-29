import { Request, Response } from 'express';
import cloudinary from 'utils/cloudinary';

interface UploadResult {
  secure_url: string;
  public_id: string;
}

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  // Validate required fields
  if (!req.file) {
    return res
      .status(400)
      .json({ status: 'error', message: 'No image file uploaded.' });
  }
  if (!type || !entityId) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Type and entityId are required.' });
  }

  try {
    // Define the upload folder structure
    const folder = `${type}/${entityId}`;

    // Upload image to Cloudinary
    const result: UploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: 'image' }, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result as UploadResult);
        })
        .end(req.file?.buffer || Buffer.alloc(0)); // Pass the file buffer
    });

    // Send the successful response
    return res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully.',
      data: {
        url: result.secure_url,
        id: result.public_id,
      },
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Image upload failed.',
      error: (error as Error).message,
    });
  }
};

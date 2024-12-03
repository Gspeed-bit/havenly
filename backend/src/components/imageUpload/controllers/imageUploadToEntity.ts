import Property from '@components/property/models/propertyModel';
import User from '@components/user/models/userModel';
import { Request, Response } from 'express';
import cloudinary from 'utils/cloudinary';


interface UploadResult {
  secure_url: string;
  public_id: string;
}

export const imageUploadToEntity = async (
  type: string,
  entityId: string,
  file: Express.Multer.File
) => {
  try {
    // Upload image to Cloudinary
    const result: UploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `${type}/${entityId}`, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            resolve(result as UploadResult);
          }
        )
        .end(file.buffer);
    });

    // Handle saving the image URL to the entity (user or property)
    let entity;
    if (type === 'user_image') {
      entity = await User.findById(entityId);
      if (entity) {
        entity.imgUrl = result.secure_url;
        await entity.save();
      }
    } else if (type === 'property_image') {
      entity = await Property.findById(entityId);
      if (entity) {
        entity.images.push(result.secure_url);
        await entity.save();
      }
    }
    return result; // Return the result to the caller for further processing
  } catch (error) {
    throw new Error(`Image upload failed: ${(error as Error).message}`);
  }
};

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const result = await imageUploadToEntity(type, entityId, req.file);

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url, // Cloudinary image URL
        id: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Image upload failed',
      error: (error as Error).message,
    });
  }
};

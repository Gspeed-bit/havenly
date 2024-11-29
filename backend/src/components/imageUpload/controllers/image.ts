import Property from '@components/property/models/propertyModel';
import User from '@components/user/models/userModel'; //
import { Request, Response } from 'express';
import cloudinary from 'utils/cloudinary';

interface UploadResult {
  secure_url: string;
  public_id: string;
}

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body; // 'type' could be 'user_profile' or 'property_image'

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  if (!type || !entityId) {
    return res.status(400).json({ message: 'Type and entityId are required.' });
  }

  try {
    // Validate that the entityId corresponds to an existing user or property
    let entity;
    if (type === 'user_profile') {
      // Fetch the user by entityId (userId) from the database
      entity = await User.findById(entityId); // Replace with your user fetching logic
      if (!entity) {
        return res.status(404).json({ message: 'User not found' });
      }
    } else if (type === 'property_image') {
      // Fetch the property by entityId (propertyId) from the database
      entity = await Property.findById(entityId); // Replace with your property fetching logic
      if (!entity) {
        return res.status(404).json({ message: 'Property not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    // Define folder structure based on entity type and ID
    const folder = `${type}/${entityId}`;

    // Upload image to Cloudinary
    const result: UploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: folder, resource_type: 'image' },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve(result as UploadResult);
          }
        )
        .end(req.file?.buffer || Buffer.alloc(0));
    });

    // Return the uploaded image URL and ID
    res.status(200).json({
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        id: result.public_id,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Image upload failed',
        error: (error as Error).message,
      });
  }
};

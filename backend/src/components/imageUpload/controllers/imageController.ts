import Property from '@components/property/models/propertyModel';
import User from '@components/user/models/userModel';
import { Request, Response } from 'express';
import cloudinary from 'utils/cloudinary';
import { IUser } from '@components/user/models/userModel'; // Import the IUser interface
import { IProperty } from '@components/property/models/propertyModel'; // Import the IProperty interface
import { Document } from 'mongoose';

interface UploadResult {
  secure_url: string;
  public_id: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']; // Allowed image types

export const uploadUserImage = async (req: Request, res: Response) => {
  const { type, entityId } = req.body; // 'type' could be 'user_image' or 'property_image'

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  // Check if the file is of an allowed type
  if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
    });
  }

  // Check if the file size is within the allowed limit
  if (req.file.size > MAX_FILE_SIZE) {
    return res
      .status(400)
      .json({ message: 'File size is too large. Maximum size is 5MB.' });
  }

  if (!type || !entityId) {
    return res.status(400).json({ message: 'Type and entityId are required.' });
  }

  try {
    // Validate that the entityId corresponds to an existing user or property
    let entity: IUser | IProperty | null;
    if (type === 'user_image') {
      entity = (await User.findById(entityId).exec()) as IUser & Document;
      if (!entity) {
        return res.status(404).json({ message: 'User not found' });
      }
    } else if (type === 'property_image') {
      entity = (await Property.findById(entityId).exec()) as IProperty &
        Document;
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

    // Store the uploaded image URL in the corresponding model
    if (type === 'user_image' && entity && isUser(entity)) {
      entity.imgUrl = result.secure_url;
      await entity.save(); // Save the updated user object
    } else if (type === 'property_image' && entity && isProperty(entity)) {
      entity.images.push(result.secure_url);
      await entity.save(); // Save the updated property object
    }

    // Return the uploaded image URL and ID
    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        id: result.public_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Image upload failed',
      error: (error as Error).message,
    });
  }
};

// Type guards for distinguishing between User and Property
function isUser(entity: IUser | IProperty): entity is IUser {
  return (entity as IUser).imgUrl !== undefined;
}

function isProperty(entity: IUser | IProperty): entity is IProperty {
  return (entity as IProperty).images !== undefined;
}

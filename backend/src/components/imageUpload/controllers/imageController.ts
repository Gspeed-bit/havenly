import { Request, Response } from 'express';
import cloudinary from 'utils/cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';
import { IUser } from '@components/user/models/userModel';
import { IProperty } from '@components/property/models/propertyModel';

interface UploadResult {
  secure_url: string;
  public_id: string;
}

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const result: UploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `${type}/${entityId}`, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            resolve(result as UploadResult);
          }
        )
        .end(req.file?.buffer || Buffer.alloc(0));
    });

    let entity: IUser | IProperty | null = null;

    if (type === 'user_image') {
      entity = await User.findById(entityId);

      if (!entity) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Narrow type to IUser
      if ('imgUrl' in entity) {
        entity.imgUrl = result.secure_url;
        await entity.save();
      } else {
        return res.status(500).json({ message: 'Entity is not a User' });
      }
    } else if (type === 'property_image') {
      entity = await Property.findById(entityId);

      if (!entity) {
        return res.status(404).json({ message: 'Property not found' });
      }

      // Narrow type to IProperty
      if ('images' in entity) {
        entity.images.push(result.secure_url);
        await entity.save();
      } else {
        return res.status(500).json({ message: 'Entity is not a Property' });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: { url: result.secure_url, id: result.public_id },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Image upload failed',
      error: (error as Error).message,
    });
  }
};


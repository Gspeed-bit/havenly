import { Request, Response } from 'express';
import {
  uploadImagesToCloudinary,
  uploadImageToCloudinary,
} from 'utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';
import Company from '@components/property/models/companyModel';

const getFolderPath = ({
  type,
  entityId,
}: {
  type: string;
  entityId: string;
}) => {
  return `${type}/${entityId}`;
};
export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const folderPath = getFolderPath({ type, entityId });
    const { secure_url, public_id } = await uploadImageToCloudinary(
      req.file.buffer,
      folderPath
    );

    if (type === 'user_image') {
      const user = await User.findById(entityId);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      if (user.imgPublicId) {
        await cloudinary.uploader.destroy(user.imgPublicId);
      }

      user.imgUrl = secure_url;
      user.imgPublicId = public_id;
      await user.save();
    } else if (type === 'company_image') {
      const company = await Company.findById(entityId);
      if (!company)
        return res.status(404).json({ message: 'Company not found.' });

      if (company.logoPublicId) {
        await cloudinary.uploader.destroy(company.logoPublicId);
      }

      company.logo = secure_url;
      company.logoPublicId = public_id;
      await company.save();
    } else {
      return res.status(400).json({ message: 'Invalid type specified.' });
    }

    res.status(200).json({
      status: 'success',
      data: { url: secure_url },
      message: 'Image uploaded successfully.',
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 'error', message: 'Image upload failed.', error });
  }
};

export const uploadMultiplePropertyImages = async (
  req: Request,
  res: Response
) => {
  const { propertyId } = req.body;
  if (!propertyId) {
    return res.status(400).json({ message: 'Property ID is required.' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    const uploadedImages = await uploadImagesToCloudinary(
      (req.files as Express.Multer.File[]).map((file) => file.buffer),
      `property_images/${propertyId}`
    );

    property.images.push(
      ...uploadedImages.map((image) => ({
        url: image.secure_url,
        public_id: image.public_id,
      }))
    );
    await property.save();

    res.status(200).json({
      status: 'success',
      data: uploadedImages,
      message: 'Images uploaded successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Image upload failed.',
      error,
    });
  }
};

export const deletePropertyImage = async (req: Request, res: Response) => {
  const { id, publicId } = req.params;
  console.log(id, publicId);
  try {
    const property = await Property.findById(id);
    if (!property) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Property not found.' });
    }

    const imageIndex = property.images.findIndex(
      (image) => image.public_id === publicId
    );

    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Image not found.' });
    }

    // Attempt to delete the image from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
    }

    // Remove the image from the property
    property.images.splice(imageIndex, 1);
    await property.save();

    res
      .status(200)
      .json({ status: 'success', message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Error in deletePropertyImage:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image.',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (error as any).message,
    });
  }
};

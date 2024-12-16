import { Request, Response } from 'express';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';
import Company from '@components/property/models/companyModel';

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const folderPath = `${type}/${entityId}`;
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
  const { entityId } = req.body;
   if (!entityId) {
     return res.status(400).json({ message: 'Property ID is required.' });
   }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded' });
  }

  try {
    const property = await Property.findById(entityId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    const uploadedImages = [];

    for (const file of req.files as Express.Multer.File[]) {
      const folderPath = `property_images/${entityId}`;
      const { secure_url, public_id } = await uploadImageToCloudinary(
        file.buffer,
        folderPath
      );
      uploadedImages.push({ url: secure_url, public_id });
    }

    property.images.push(...uploadedImages);
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

  try {
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    const imageIndex = property.images.findIndex(
      (image) => image.public_id === publicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    await cloudinary.uploader.destroy(publicId);

    property.images.splice(imageIndex, 1);
    await property.save();

    res.status(200).json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete image.', error });
  }
};

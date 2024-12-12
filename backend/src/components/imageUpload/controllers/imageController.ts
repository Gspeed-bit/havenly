// controllers/imageController.ts

import { Request, Response } from 'express';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';
import Company from '@components/property/models/companyModel';

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({ message: 'No image files uploaded' });
  }

  try {
    const uploadedImages = await Promise.all(
      (req.files as Express.Multer.File[]).map(async (file) => {
        const { secure_url, public_id } = await uploadImageToCloudinary(
          file.buffer,
          `${type}/${entityId}`
        );
        return { url: secure_url, public_id };
      })
    );

    if (type === 'user_image') {
      const user = await User.findById(entityId);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      // Delete the previous image if it exists
      if (user.imgPublicId) {
        await cloudinary.uploader.destroy(user.imgPublicId);
      }

      // Save the new image
      const { url, public_id } = uploadedImages[0]; // Only one user image is allowed
      user.imgUrl = url;
      user.imgPublicId = public_id;
      await user.save();
    } else if (type === 'property_image') {
      const property = await Property.findById(entityId);
      if (!property)
        return res.status(404).json({ message: 'Property not found.' });

      // Save the new images
      property.images.push(...uploadedImages);
      await property.save();
    } else if (type === 'company_image') {
      const company = await Company.findById(entityId);
      if (!company)
        return res.status(404).json({ message: 'Company not found.' });

      // Delete the previous logo if it exists
      if (company.logoPublicId) {
        await cloudinary.uploader.destroy(company.logoPublicId);
      }

      // Save the new logo directly as a string (remove object wrapping)
      const { url, public_id } = uploadedImages[0]; // Only one company logo is allowed
      company.logo = url; // Store the URL as a string
      company.logoPublicId = public_id; // Store the public_id as a string
      await company.save();
    } else {
      return res.status(400).json({ message: 'Invalid type specified.' });
    }

    return res.status(200).json({
      status: 'success',
      data: uploadedImages,
      message: 'Images uploaded successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Image upload failed.',
      error: (error as Error).message,
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

    // Find and remove the image
    const imageIndex = property.images.findIndex(
      (image) => image.public_id === publicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove the image from the database
    property.images.splice(imageIndex, 1);
    await property.save();

    return res.status(200).json({
      message: 'Image deleted successfully.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to delete image.',
      error: (error as Error).message,
    });
  }
};


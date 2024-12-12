import { Request, Response } from 'express';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';
import Company from '@components/property/models/companyModel';

const deletePreviousImage = async (publicId: string) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

const removeImageFolderIfEmpty = async (
  folderPath: string,
  entityId: string
) => {
  const images = await cloudinary.api.resources({
    type: 'upload',
    prefix: folderPath,
  });

  if (images.resources.length === 0) {
    await cloudinary.api.delete_folder(folderPath);
  }
};

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const { secure_url, public_id } = await uploadImageToCloudinary(
      req.file.buffer,
      `${type}/${entityId}`
    );

    if (type === 'user_image') {
      const user = await User.findById(entityId);
      if (!user) return res.status(404).json({ message: 'User not found.' });

      // Delete previous image if it exists
      if (user.imgPublicId) {
        await deletePreviousImage(user.imgPublicId);
      }

      // Save new image
      user.imgUrl = secure_url;
      user.imgPublicId = public_id;
      await user.save();
    } else if (type === 'property_image') {
      const property = await Property.findById(entityId);
      if (!property)
        return res.status(404).json({ message: 'Property not found.' });

      // Save new image
      property.images.push({ url: secure_url, public_id });
      await property.save();
    } else if (type === 'company_image') {
      const company = await Company.findById(entityId);
      if (!company)
        return res.status(404).json({ message: 'Company not found.' });
      if (company.logoPublicId) {
        await deletePreviousImage(company.logoPublicId);
      }
      // Delete previous logo if it exists
      await deletePreviousImage(company.logoPublicId);

      // Save new logo
      company.logo = secure_url;
      company.logoPublicId = public_id;
      await company.save();

      // Clean up Cloudinary folder if no other company images exist
      await removeImageFolderIfEmpty(`company/${entityId}`, entityId);
    } else {
      return res.status(400).json({ message: 'Invalid type specified.' });
    }

    return res.status(200).json({
      status: 'success',
      data: { url: secure_url },
      message: 'Image uploaded successfully.',
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

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove image from property object
    property.images.splice(imageIndex, 1);

    // If no images left for property, delete the folder
    if (property.images.length === 0) {
      await removeImageFolderIfEmpty(`property_images/${id}`, id);
    }

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

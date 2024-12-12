import { Request, Response } from 'express';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';
import Company from '@components/property/models/companyModel';

const isArrayOfImages = (
  uploadedImages:
    | { secure_url: string; public_id: string }
    | { secure_url: string; public_id: string }[]
): uploadedImages is { secure_url: string; public_id: string }[] => {
  return Array.isArray(uploadedImages);
};

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({ message: 'No image files uploaded' });
  }

  try {
    const files = req.files as Express.Multer.File[];
    const fileBuffers = files.map((file) => file.buffer); // Extract file buffers

    // Upload images to Cloudinary
    const uploadedImages = await uploadImageToCloudinary(
      fileBuffers,
      `${type}/${entityId}`
    );

    // Handle single vs multiple image upload
    if (isArrayOfImages(uploadedImages)) {
      // It's an array of images
      const images = uploadedImages.map((image) => ({
        secure_url: image.secure_url,
        public_id: image.public_id,
      }));

      // Handle your image saving logic here
      if (type === 'property_image') {
        const property = await Property.findById(entityId);
        if (!property) {
          return res.status(404).json({ message: 'Property not found.' });
        }
        property.images.push(...images.map(image => ({ url: image.secure_url, public_id: image.public_id })));
        await property.save();
      }
    } else {
      // It's a single image
      const { secure_url, public_id } = uploadedImages;

      if (type === 'user_image') {
        const user = await User.findById(entityId);
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }

        // Delete the previous image if it exists
        if (user.imgPublicId) {
          await cloudinary.uploader.destroy(user.imgPublicId);
        }

        // Save the new image
        user.imgUrl = secure_url;
        user.imgPublicId = public_id;
        await user.save();
      } else if (type === 'company_image') {
        const company = await Company.findById(entityId);
        if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
        }

        // Delete the previous logo if it exists
        if (company.logoPublicId) {
          await cloudinary.uploader.destroy(company.logoPublicId);
        }

        // Save the new logo
        company.logo = secure_url;
        company.logoPublicId = public_id;
        await company.save();
      } else {
        return res.status(400).json({ message: 'Invalid type specified.' });
      }
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

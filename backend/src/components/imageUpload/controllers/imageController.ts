import { Request, Response } from 'express';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';
import Company from '@components/property/models/companyModel';

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const { secure_url } = await uploadImageToCloudinary(
      req.file.buffer,
      `${type}/${entityId}`
    );

    if (type === 'user_image') {
      const user = await User.findById(entityId);
      if (!user) return res.status(404).json({ message: 'User not found.' });
      user.imgUrl = secure_url;
      await user.save();
    } else if (type === 'property_image') {
      const property = await Property.findById(entityId);
      if (!property)
        return res.status(404).json({ message: 'Property not found.' });
      property.images.push(secure_url);
      await property.save();
    } else if (type === 'company_image') {
      const company = await Company.findById(entityId);
      if (!company)
        return res.status(404).json({ message: 'Company not found.' });

      company.logo = secure_url;
      await company.save();

      return res.status(200).json({
        status: 'success',
        data: { url: secure_url },
        message: 'Company image uploaded and saved successfully.',
      });
    } else {
      return res.status(400).json({ message: 'Invalid type specified.' });
    }

    return res.status(200).json({
      status: 'success',
      data: { url: secure_url },
      message: 'Image uploaded successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Image upload failed.',
      error: (error as Error).message,
    });
  }
};

import { Request, Response } from 'express';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import User from '@components/user/models/userModel';
import Property from '@components/property/models/propertyModel';

export const imageUpload = async (req: Request, res: Response) => {
  const { type, entityId } = req.body;
  if (!req.file)
    return res.status(400).json({ message: 'No image file uploaded' });

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
    }

    res
      .status(200)
      .json({ message: 'Image uploaded successfully.', url: secure_url });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Image upload failed.', error: error.message });
  }
};

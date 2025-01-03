import { Request, Response } from 'express';
import User, { IUser } from '@components/user/models/userModel';
import { StatusCodes } from 'utils/apiResponse';
import { sanitizeUser } from 'utils/sanitizeUser';
import {
  generateVerificationCode,
  sendAdminUpdatePinEmail,
} from 'utils/email/emailUtils';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id); // Mongoose document returned

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    // Convert the document to a plain object
    const userResponse = sanitizeUser(
      user.toObject() as unknown as Record<string, unknown>,
      ['password', 'resetPasswordCode', 'verificationCode']
    ); // Sanitize sensitive fields

    return res.json(userResponse);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error fetching user', error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Check if the authenticated user is an admin
    if (!req.user?.isAdmin) {
      console.log('Access denied - User is not an admin');
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Access denied' });
    }

    // Fetch all users excluding admins (those with isAdmin: false)
    const users = await User.find({ isAdmin: false }).lean(); // Only non-admin users

    // Sanitize each user before sending
    const sanitizedUsers = users.map((user) =>
      sanitizeUser(user, [
        'password',
        'resetPasswordCode',
        'verificationCode',
        'verificationCodeExpiration',
      ])
    );
    // Return the list of users
    res.json(sanitizedUsers);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error retrieving users', err });
  }
};

// Get all admin users
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdmin) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Access denied' });
    }

    const admins = await User.find({ adminCode: process.env.ADMIN_CODE });
    // Sanitize the admin users before sending
    const sanitizedAdmins = admins.map((admin) =>
      sanitizeUser(admin.toObject() as unknown as Record<string, unknown>, [
        'password',
        'resetPasswordCode',
        'verificationCode',
        'resetPasswordExpiration',
      ])
    );

    res.json(sanitizedAdmins);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Server error', error });
  }
};

// User Profile Update Handler
export const updateUserProfile = async (req: Request, res: Response) => {
  const { firstName, lastName, phoneNumber, pin } = req.body;
  const { isAdmin, _id: userId } = req.user;

  // Build updates object dynamically
  const updates: Partial<IUser> = {}; // Type-safe updates object
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (phoneNumber) updates.phoneNumber = phoneNumber;

  // Prevent unauthorized email updates
  if (req.body.email) {
    return res.status(400).json({ message: 'Email updates are not allowed.' });
  }

  // Handle Admin PIN validation
  if (isAdmin && (!pin || adminPins[userId] !== pin)) {
    return res.status(400).json({ message: 'Invalid or missing PIN.' });
  }

  // If admin PIN is valid, clear it after validation
  if (isAdmin) {
    delete adminPins[userId]; // Clear the PIN after validation
  }

  try {
    // Update user profile in the database
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Handle image upload if a file is provided
    if (req.file) {
      // Upload new image to Cloudinary
      const { secure_url, public_id } = await uploadImageToCloudinary(
        req.file.buffer,
        `user_image/${userId}`
      );

      // If the user already has a profile image, delete the previous one
      if (user.imgPublicId) {
        await cloudinary.uploader.destroy(user.imgPublicId);
      }

      // Update user image fields
      user.imgUrl = secure_url;
      user.imgPublicId = public_id;
    }

    // Save the updated user profile
    await user.save();

    // Sanitize the user data before returning
    const sanitizedUser = sanitizeUser(
      user.toObject() as unknown as Record<string, unknown>,
      ['password']
    );
    console.log('Updating user with:', updates);

    res.json({ message: 'Profile updated successfully.', user: sanitizedUser });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    res
      .status(500)
      .json({ message: 'An error occurred.', error: errorMessage });
  }
};

// Admin Profile Update Handler
const adminPins: Record<string, string> = {}; // Temporary storage for PINs

// Request PIN for Admin Profile Update
export const requestAdminUpdatePin = async (req: Request, res: Response) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  const pin = generateVerificationCode(6); // Generate a 6-digit PIN
  adminPins[req.user._id] = pin;

  // Send the PIN to the admin's email
  await sendAdminUpdatePinEmail(req.user.email, pin, req.user.name);

  return res.json({ message: 'PIN sent to your Email.' });
};

// Confirm Admin Profile Update
export const confirmAdminUpdate = async (req: Request, res: Response) => {
  const { firstName, lastName, phoneNumber, pin } = req.body;

  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  if (adminPins[req.user._id] !== pin) {
    return res.status(400).json({ message: 'Invalid or expired PIN.' });
  }

  delete adminPins[req.user._id]; // Remove used PIN

  // Ensure updates object exists before checking for email

  if (req.body.email) {
    return res
      .status(400)
      .json({ message: 'Admins cannot update their email.' });
  }

  // Build updates object dynamically
  const updates: Partial<IUser> = {}; // Type-safe updates object
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (phoneNumber) updates.phoneNumber = phoneNumber;

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: 'Admin not found.' });

    // Sanitize user data before returning
    const sanitizedUser = sanitizeUser(
      user.toObject() as unknown as Record<string, unknown>,
      ['password', 'email']
    );
    res.json({ message: 'Profile updated successfully.', user: sanitizedUser });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    res
      .status(500)
      .json({ message: 'An error occurred.', error: errorMessage });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // Assume `req.user` contains the authenticated user's info
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Both current and new passwords are required.' });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Current password is incorrect.' });
    }

    // Check if new password matches the old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'New password must be different from the old password.',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res
      .status(StatusCodes.SUCCESS)
      .json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'An error occurred while changing the password.' });
  }
};

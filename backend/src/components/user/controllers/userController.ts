import { Request, Response } from 'express';
import User from '../models/userModel';
import { StatusCodes } from 'utils/apiResponse';

import {
  generateVerificationCode,
  sendAdminUpdatePinEmail,
} from 'utils/emailUtils';
import { uploadImageToCloudinary } from 'utils/cloudinary';
import bcrypt from 'bcrypt';

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
  const { updates, pin } = req.body;
  const { isAdmin, _id: userId } = req.user;

  // Ensure updates object is present
  if (!updates) {
    return res.status(400).json({ message: 'No updates provided.' });
  }

  // Prevent email updates
  if (updates?.email) {
    return res.status(400).json({ message: 'Email updates are not allowed.' });
  }

  // Admin pin validation
  if (isAdmin && (!pin || adminPins[userId] !== pin)) {
    return res.status(400).json({ message: 'Invalid or missing PIN.' });
  }

  // Remove PIN after successful validation for admins
  if (isAdmin) delete adminPins[userId];

  try {
    // Handle profile image upload
    if (req.file) {
      const { secure_url } = await uploadImageToCloudinary(
        req.file.buffer,
        `user_images/${userId}`
      );
      updates.imgUrl = secure_url; // Assign the new image URL to updates
    }

    // Log the updates to check what's being passed
    console.log('Updates:', updates);

    // Update the user profile in the database
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Log the updated user for debugging
    console.log('Updated User:', user);

    // Sanitize the user object to remove sensitive data (e.g., password)
    const sanitizedUser = sanitizeUser(
      user.toObject() as unknown as Record<string, unknown>,
      ['password']
    );

    // Send response with updated user
    return res.json({
      message: 'Profile updated successfully.',
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred.', error: (error as Error).message });
  }
};

// Helper function to sanitize user data (if necessary)
function sanitizeUser(user: Record<string, unknown>, fieldsToRemove: string[]) {
  fieldsToRemove.forEach((field) => delete user[field]);
  return user;
}


// Admin Profile Update Handler
const adminPins: Record<string, string> = {}; // Temporary storage for PINs

// Request PIN for Admin Profile Update
export const requestAdminUpdatePin = async (req: Request, res: Response) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  const pin = generateVerificationCode(6);
  adminPins[req.user._id] = pin;

  await sendAdminUpdatePinEmail(req.user.email, pin, req.user.name);

  return res.json({ message: 'PIN sent to your email.' });
};

// Confirm Admin Profile Update
export const confirmAdminUpdate = async (req: Request, res: Response) => {
  const { pin, updates } = req.body;

  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  if (adminPins[req.user._id] !== pin) {
    return res.status(400).json({ message: 'Invalid or expired PIN.' });
  }

  delete adminPins[req.user._id];

  if (updates?.email) {
    return res
      .status(400)
      .json({ message: 'Admins cannot update their email.' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: 'Admin not found.' });

    const sanitizedUser = sanitizeUser(user.toObject() as unknown as Record<string, unknown>, ['password', 'email']);
    res.json({ message: 'Profile updated successfully.', user: sanitizedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred.', error: (error as Error).message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Both current and new passwords are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Current password is incorrect.' });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res
        .status(400)
        .json({
          message: 'New password must be different from the old password.',
        });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res
      .status(500)
      .json({ message: 'An error occurred.', error: (error as Error).message });
  }
};

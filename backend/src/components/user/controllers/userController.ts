import { Request, Response } from 'express';
import User from '../models/userModel';
import { StatusCodes } from 'utils/apiResponse';
import { sanitizeUser } from 'utils/sanitizeUser';
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
  const { updates } = req.body;
  const { _id: userId } = req.user;

  // Debugging - Log incoming updates
  console.log('Received updates:', updates);

  try {
    // Validate if updates were provided
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updates provided.' });
    }

    // Handle file upload if an image is provided
    if (req.file) {
      const { secure_url } = await uploadImageToCloudinary(
        req.file.buffer,
        `user_images/${userId}`
      );
      updates.imgUrl = secure_url; // Set the uploaded image URL to the updates object
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure the updates are validated according to the schema
      }
    );

    // Debugging - Log updated user data
    console.log('Updated user:', updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Sanitize the user data (remove sensitive fields like password)
    const sanitizedUser = sanitizeUser(updatedUser.toObject() as unknown as Record<string, unknown>, ['password']);

    // Send the response
    res.json({
      message: 'Profile updated successfully.',
      user: sanitizedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      message: 'An error occurred while updating the profile.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
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
  const { pin, updates } = req.body;

  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  if (adminPins[req.user._id] !== pin) {
    return res.status(400).json({ message: 'Invalid or expired PIN.' });
  }

  delete adminPins[req.user._id]; // Remove used PIN

  // Ensure updates object exists before checking for email
  if (updates && updates.email) {
    return res
      .status(400)
      .json({ message: 'Admins cannot update their email.' });
  }

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

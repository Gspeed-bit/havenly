import { Request, Response } from 'express';
import User from '../models/userModel';
import { StatusCodes } from 'utils/apiResponse';
import { sanitizeUser } from 'utils/sanitizeUser';
import {
  generateVerificationCode,
  sendAdminUpdatePinEmail,
} from 'utils/emailUtils';

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id); // Assuming `req.user` is populated by middleware

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    // Convert the document to a plain object and sanitize sensitive fields
    const userResponse = sanitizeUser(
      user.toObject() as unknown as Record<string, unknown>,
      ['password', 'resetPasswordCode', 'verificationCode']
    );

    // Include the `imgUrl` field explicitly if it's not excluded in `sanitizeUser`
    return res.status(StatusCodes.SUCCESS).json({
      status: 'success',
      data: {
        ...userResponse,
        imgUrl: user.imgUrl, // Ensuring `imgUrl` is included in the response
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res
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
  const updates = req.body;

  // Prevent email updates
  if (updates.email) {
    return res
      .status(400)
      .json({ message: 'Users cannot update their email.' });
  }

  // Prevent admins from updating their profile
  if (req.user?.isAdmin) {
    return res.status(403).json({
      message: 'Admins cannot update their profile through this route.',
    });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found.' });

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

  delete adminPins[req.user._id]; // Remove used PIN

  if (updates.email) {
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

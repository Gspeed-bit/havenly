import { Request, Response } from 'express';
import User from '../models/userModel';

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id); // Mongoose document returned

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Convert the document to a plain object
  const userResponse = { ...user.toObject(), isAdmin: user.isAdmin };

  return res.json(userResponse);
};

export const getAllUsers = async (req: Request, res: Response) => {
  // Check if the authenticated user is an admin
  if (!req.user?.isAdmin) {
    console.log('Access denied - User is not an admin');
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // Fetch all users excluding admins (those with isAdmin: false)
    const users = await User.find({ isAdmin: false }).lean(); // Only non-admin users

    // Return the list of users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

//Get all admin
export const getAllAdmins = async (req: Request, res: Response) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const admins = await User.find({ adminCode: process.env.ADMIN_CODE });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

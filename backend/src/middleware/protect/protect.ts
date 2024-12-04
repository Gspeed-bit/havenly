import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@components/user/models/userModel';
import { IUser } from '@components/user/models/userModel';

interface UserPayload {
  id: string;
  isAdmin?: boolean;
}

// Helper function to verify token and return payload
const verifyToken = (req: Request): UserPayload | null => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  try {
    return jwt.verify(token, secret) as UserPayload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null; // Handle verification error (e.g., expired token)
  }
};

// Middleware to check if the user is authenticated
export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = verifyToken(req);
    if (!payload) {
      return res
        .status(401)
        .json({ message: 'Authorization denied, no token provided.' });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user to the request object
    req.user = user as IUser;
    next();
  } catch (err) {
    console.error('Error in userMiddleware:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to check if the user is an admin
export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = verifyToken(req);
    if (!payload) {
      return res
        .status(401)
        .json({ message: 'Authorization denied, no token provided.' });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Determine admin status
    const isAdmin =
      payload.isAdmin || user.adminCode === process.env.ADMIN_CODE;

    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Attach user and admin status to the request object
    req.user = user as IUser;
    req.user.isAdmin = isAdmin; // Set the actual admin status

    next();
  } catch (err) {
    console.error('Error in authMiddleware:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

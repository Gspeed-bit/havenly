import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@components/user/models/userModel';
import { IUser } from '@components/user/models/userModel';

// Interface for JWT payload
interface UserPayload {
  id: string;
  isAdmin?: boolean;
}

// Middleware to authenticate all users (both admins and regular users)
export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as UserPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user as IUser;
    req.user.isAdmin =
      user.adminCode === process.env.ADMIN_CODE || user.isAdmin;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token or token expired' });
  }
};

// Middleware to restrict access to admins only
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

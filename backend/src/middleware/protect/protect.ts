import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@components/user/models/userModel';
import { IUser } from '@components/user/models/userModel';

interface UserPayload {
  id: string;
  isAdmin?: boolean; // Admin field is optional here since it's checked separately
}

export const protect = async (
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

    // Proceed without checking admin here; defer it to route-specific logic if needed
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

// Middleware for admin-only routes
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied - Admins only' });
  }
  next();
};

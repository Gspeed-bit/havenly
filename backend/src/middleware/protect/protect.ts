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
    // Check for token in the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });
    }

    // Check for the JWT secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Verify the token and decode the user data
    const decoded = jwt.verify(token, secret) as UserPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user data to the request object
    req.user = user as IUser;

    // Admin check: If the user is not admin, return a 403 status
    if (decoded.isAdmin === undefined || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied - Admins only' });
    }

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

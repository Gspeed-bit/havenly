import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@components/user/models/userModel'; // Assuming User model is imported
import { IUser } from '@components/user/models/userModel'; // TypeScript interface for the user

interface UserPayload {
  id: string;
  isAdmin?: boolean;
}

// Protect middleware
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization denied, no token' });
    }

    // Secret key used to verify JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, secret) as UserPayload;

    // Fetch user from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user to the request object
    req.user = user as IUser;

    // Check for admin privileges based on token or adminCode
    req.user.isAdmin =
      decoded.isAdmin || user.adminCode === process.env.ADMIN_CODE;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

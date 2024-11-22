import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@components/user/models/userModel';
import { IUser } from '@components/user/models/userModel';

interface UserPayload {
  isAdmin: boolean;
  id: string;
}

export const authMiddleware = async (
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
      decoded.isAdmin || user.adminCode === process.env.ADMIN_CODE;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


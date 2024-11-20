import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@models/userModel';
import { IUser } from '../components/user/types/userTypes';

interface UserPayload {
  id: string;
}

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

    // Attach user data to the request object
    req.user = user as IUser;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '@components/user/models/userModel';

const router = express.Router();

const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    } catch {
      return res.status(500).json({ message: 'Server error' });
    }
  });
};

router.get(
  '/user',
  authenticateToken,
  (req: express.Request, res: express.Response) => {
    const user = req.user;
    return res.json({ user });
  }
);

export default router;

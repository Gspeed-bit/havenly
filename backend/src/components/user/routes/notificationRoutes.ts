import { Router } from 'express';
import {
  getNotifications,
  markNotificationAsRead,
} from '../controllers/notificationController';
import { userMiddleware } from '@middleware/userAndAdminMiddleware/protect';

const router = Router();

// Route to get notifications (User Only)
router.get('/notifications', userMiddleware, getNotifications);

// Route to mark a notification as read (User Only)
router.put(
  '/notifications/:notificationId/read',
  userMiddleware,
  markNotificationAsRead
);

export default router;

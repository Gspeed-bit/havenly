import { Router } from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController';
import {

  userMiddleware,
} from '@middleware/userAndAdminMiddleware/protect'; // Assuming you have this middleware to protect routes

const router = Router();

router.get('/notifications', userMiddleware, getNotifications);

router.put(
  '/notifications/:notificationId/read',
  userMiddleware,
  markNotificationAsRead
);


export default router;

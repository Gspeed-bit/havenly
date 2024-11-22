import express from 'express';
import { userMiddleware } from '@middleware/userMiddleware';
import {
  getNotifications,
  markAsRead,
} from '@controllers/controllers/notificationController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Endpoints for managing user notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Notification ID
 *                   userId:
 *                     type: string
 *                     description: ID of the user the notification belongs to
 *                   message:
 *                     type: string
 *                     description: Notification message
 *                   read:
 *                     type: boolean
 *                     description: Read status of the notification
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Notification creation timestamp
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Notification update timestamp
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/notifications', userMiddleware, getNotifications);

/**
 * @swagger
 * /notifications/{notificationId}:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification marked as read.
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put('/notifications/:notificationId', userMiddleware, markAsRead);

export default router;

import { Request, Response } from 'express';
import Notification from '../models/notificationModel';

// Get Notifications Handler
export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { isAdmin } = req.user;

  try {
    const notifications = isAdmin
      ? await Notification.find().sort({ createdAt: -1 })
      : await Notification.find({ receiverId: userId }).sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch notifications' });
  }
};

// Mark Notification as Read Handler
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;
  const userId = req.user.id;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, receiverId: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Notification not found' });
    }

    res.status(200).json({ status: 'success', data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res
      .status(500)
      .json({
        status: 'error',
        message: 'Failed to mark notification as read',
      });
  }
};

// Send Notification Handler
export const sendNotification = async (
  receiverId: string,
  type: 'inquiry' | 'response',
  message: string
) => {
  try {
    const notification = await Notification.create({
      receiverId,
      type,
      message,
      isRead: false,
    });
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to create notification');
  }
};

import { Request, Response } from 'express';
import Notification from '@models/notificationModel';
import mongoose from 'mongoose';

// Get notifications for a user
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Sort by most recent
      .exec();

    if (!notifications || notifications.length === 0) {
      return res.status(200).json({
        message: 'No notifications available.',
        notifications: [],
      });
    }

    res.status(200).json({
      message: 'Notifications retrieved successfully.',
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mark a notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a notification (utility function for internal use)
export const createNotification = async (
  userId: string,
  inquiryId: string | undefined,
  message: string,
  propertySold = false // Add propertySold parameter
) => {
  try {
    const notification = await Notification.create({
      userId,
      inquiryId,
      message,
      propertySold,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Handle property sale
export const markPropertyAsSold = async (
  propertyId: mongoose.Types.ObjectId
) => {
  try {
    const notifications = await Notification.find({
      propertySold: false,
      inquiryId: { $in: [propertyId] },
    });

    for (const notification of notifications) {
      notification.propertySold = true;
      notification.message = 'The property you inquired about has been sold.';
      await notification.save();
    }
  } catch (error) {
    console.error('Error marking property as sold:', error);
  }
};

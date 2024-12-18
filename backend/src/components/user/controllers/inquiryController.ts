import { Request, Response } from 'express';
import Inquiry from '@components/user/models/inquiryModel';
import Notification from '@components/user/models/notificationModel';
import Property from 'components/property/models/propertyModel';
import { sendInquiryEmail } from 'utils/emailUtils';

import { createNotification } from './notificationController';

export const sendInquiry = async (req: Request, res: Response) => {
  try {
    const { propertyId, message } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Populate company field with full object (including email)
    const property = await Property.findById(propertyId).populate('company');
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    const newInquiry = new Inquiry({
      userId: user._id,
      propertyId,
      message,
    });
    await newInquiry.save();

    // Ensure the company object has the email field
    const company = property.company; // Now this should be a fully populated object
    if (!company || !company.email) {
      return res.status(400).json({ message: 'Company email not found.' });
    }
    const userName = user.name || `${user.firstName} ${user.lastName}`;

    // Send inquiry email to the company (property owner)
    await sendInquiryEmail(
      user.email,
      property.title,
      property.location,
      property.price.toString(),
      property.description,
      company.email,
      userName
    );

    res
      .status(201)
      .json({ message: 'Inquiry sent successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update inquiry status and notify user
export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: 'Permission denied. Admins only.' });
    }

    const { id } = req.params;
    const { status, customMessage, propertySold } = req.body;

    if (!['Submitted', 'Under Review', 'Answered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status, customMessage },
      { new: true, runValidators: true }
    ).populate('userId');

    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    const inquiryId = (updatedInquiry._id as string).toString();
    const userId = updatedInquiry.userId?._id.toString();

    if (!userId) {
      return res
        .status(400)
        .json({ message: 'User not found for this inquiry.' });
    }

    // Create a notification
    const notificationMessage = `Your inquiry status has been updated to "${status}". ${
      customMessage || ''
    }`;
    const notification = await createNotification(
      userId,
      inquiryId,
      notificationMessage,
      propertySold || false
    );

    // Emit a Socket.IO event to the user
    req.io?.to(userId).emit('inquiry-update', { notification });

    res.json({
      message: 'Inquiry status updated successfully, and notification sent.',
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const { status, propertyId, userId, page = 1, limit = 10 } = req.query;
    const filters: Record<string, unknown> = req.user?.isAdmin
      ? {}
      : { userId: req.user?._id };

    if (status) filters.status = status;
    if (propertyId) filters.propertyId = propertyId;
    if (req.user?.isAdmin && userId) filters.userId = userId;

    const inquiries = await Inquiry.find(filters)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('propertyId', 'title location price')
      .populate('userId', 'name email');

    res.json({
      message: 'Inquiries retrieved successfully.',
      inquiries,
      pagination: { page: +page, limit: +limit, total: inquiries.length },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve inquiries.', error });
  }
};

// Mark property as sold and notify users
export const markPropertyAsSold = async (propertyId: string) => {
  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      console.log('Property not found');
      return;
    }

    // Mark the property as sold in the database
    property.sold = true;
    await property.save();

    // Notify users who inquired about the property that it has been sold
    await Notification.markPropertyAsSold(propertyId);
  } catch (error) {
    console.error('Error marking property as sold:', error);
  }
};

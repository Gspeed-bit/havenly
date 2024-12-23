import { Request, Response } from 'express';
import Inquiry from '../models/inquiryModel';

import Property from '../../property/models/propertyModel';
import { sendNotification } from './notificationController';

// Create Inquiry Handler
export const createInquiry = async (req: Request, res: Response) => {
  // Assert that req.user is present before accessing
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { propertyId, message } = req.body;
  const userId = req.user.id; // Now we can safely access req.user

  try {
    // Fetch property and populate company details
    const property = await Property.findById(propertyId).populate<{
      company: { _id: string };
    }>('company');
    if (!property) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Property not found' });
    }

    // Ensure company ID is a string
    const companyId = property.company._id as string;

    // Create a new inquiry
    const inquiry = await Inquiry.create({
      propertyId,
      userId,
      message,
      isResponded: false,
    });

    // Send notification to the company
    const notificationMessage = `New inquiry for property: ${property.title}`;
    await sendNotification(companyId, 'inquiry', notificationMessage);

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(companyId).emit('newInquiry', {
      inquiryId: inquiry._id,
      propertyId,
      message: notificationMessage,
    });

    res.status(201).json({ status: 'success', data: inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to create inquiry' });
  }
};

// Respond to Inquiry Handler
export const respondToInquiry = async (req: Request, res: Response) => {
  // Assert that req.user is present before accessing
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { inquiryId } = req.params;
  const { response } = req.body;
 

  try {
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Inquiry not found' });
    }

    inquiry.response = response;
    inquiry.isResponded = true;
    await inquiry.save();

    // Send notification to the user who made the inquiry
    const notificationMessage = `Your inquiry for property ${inquiry.propertyId} has been answered`;
    await sendNotification(inquiry.userId, 'response', notificationMessage);

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(inquiry.userId.toString()).emit('inquiryResponse', {
      inquiryId,
      message: notificationMessage,
    });

    res.status(200).json({ status: 'success', data: inquiry });
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to respond to inquiry' });
  }
};

export const getInquiriesForAdmin = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch inquiries' });
  }
};

export const getInquiriesForUser = async (req: Request, res: Response) => {
  const userId = req.user.id; // Assuming you have user info in req.user

  try {
    const inquiries = await Inquiry.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: inquiries });
  } catch (error) {
    console.error('Error fetching user inquiries:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch user inquiries' });
  }
};

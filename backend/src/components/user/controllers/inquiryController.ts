import { Request, Response } from 'express';
import Inquiry from '../models/inquiryModel';
import Property from '../../property/models/propertyModel';
import { sendNotification } from './notificationController';


// Create Inquiry Handler
export const createInquiry = async (req: Request, res: Response) => {
  const { propertyId, userEmail, userName, message } = req.body;
  const userId = req.user.id;

  if (!propertyId || !userId || !userEmail || !userName || !message) {
    return res
      .status(400)
      .json({ status: 'error', message: 'All fields are required' });
  }

  try {
    // Fetch the property and ensure it exists
    const property = await Property.findById(propertyId).populate<{
      company: { _id: string };
    }>('company');
    if (!property) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Property not found' });
    }

    // Get the company ID from the property
    const companyId = property.company._id;

    // Create the inquiry
     const inquiry = new Inquiry({
       propertyId,
       userId,
       message,
       userEmail,
       userName,
     });
     await inquiry.save();
    console.log('Inquiry created:', inquiry); // Debugging log

    // Send a notification to the company
    const notificationMessage = `New inquiry for property: ${property.title}`;
    await sendNotification(companyId, 'inquiry', notificationMessage);

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(companyId).emit('newInquiry', {
      inquiryId: inquiry._id,
      message: notificationMessage,
    });

    res.status(201).json({ status: 'success', data: inquiry });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating inquiry:', error.message, error);
    } else {
      console.error('Error creating inquiry:', error);
    }
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to create inquiry' });
  }
};


// Respond to Inquiry Handler
export const respondToInquiry = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
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

// Get Inquiries for Admin
export const getInquiriesForAdmin = async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('propertyId', 'title') // Populate propertyId with the title field from the Property model
      .populate('userId', 'lastName firstName email') // Populate userId with name and email fields from the User model
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', data: inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch inquiries' });
  }
};



// Get Inquiries for User
export const getInquiriesForUser = async (req: Request, res: Response) => {
  const userId = req.user.id;

  try {
    const inquiries = await Inquiry.find({ userId })
      .populate('propertyId', 'title') // Populate the propertyId field with the title from the Property model
      .populate('userId', 'lastName firstName email') // Populate userId with name and email fields from the User model
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 'success', data: inquiries });
  } catch (error) {
    console.error('Error fetching user inquiries:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Failed to fetch user inquiries' });
  }
};

import { Request, Response } from 'express';
import Property from 'components/property/models/propertyModel';
import Inquiry from '@models/inquiryModel';
import { sendInquiryEmail } from 'utils/emailUtils';

// Controller for sending inquiries
export const sendInquiry = async (req: Request, res: Response) => {
  try {
    const { propertyId, message } = req.body;
    const user = req.user; // Assuming `userMiddleware` attaches user data to the request

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Validate the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check for existing inquiry
    const existingInquiry = await Inquiry.findOne({
      userId: user._id,
      propertyId,
    });

    if (existingInquiry) {
      return res
        .status(400)
        .json({
          message: 'You have already sent an inquiry for this property.',
        });
    }

    // Validate message length
    if (!message || message.trim().length < 10) {
      return res
        .status(400)
        .json({ message: 'Message must be at least 10 characters long.' });
    }

    // Create the inquiry
    const newInquiry = new Inquiry({
      userId: user._id,
      propertyId,
      message,
    });

    await newInquiry.save();

    // Send confirmation email to the user
    await sendInquiryEmail(
      user.email,
      property.title,
      property.location,
      property.price.toString(),
      property.description
    );
    res
      .status(201)
      .json({ message: 'Inquiry sent successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const { status, propertyId, userId } = req.query;

    // Admins can retrieve all inquiries, users only their own
    const filters: Record<string, unknown> = req.user?.isAdmin
      ? {}
      : { userId: req.user?._id };

    if (status) filters.status = status;
    if (propertyId) filters.propertyId = propertyId;
    if (req.user?.isAdmin && userId) filters.userId = userId;

    const inquiries = await Inquiry.find(filters)
      .populate('propertyId', 'title location price')
      .populate('userId', 'name email');

    if (inquiries.length === 0) {
      return res
        .status(200)
        .json({ message: 'No inquiries found.', inquiries: [] });
    }

    res.json({ message: 'Inquiries retrieved successfully.', inquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve inquiries.', error });
  }
};


export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: 'Permission denied. Admins only.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    if (!['Submitted', 'Under Review', 'Answered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    // Update the inquiry status
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    res.json({ message: 'Inquiry status updated.', inquiry: updatedInquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


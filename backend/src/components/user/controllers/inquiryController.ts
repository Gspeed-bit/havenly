import { Request, Response } from 'express';

import Property from 'components/property/models/propertyModel';
import Inquiry from '@models/inquiryModel';


export const sendInquiry = async (req: Request, res: Response) => {
  try {
    const { propertyId, message, contactInfo } = req.body;
    const userId = req.user?.id; // Assuming user info is available from auth middleware

    if (!userId) {
      return res.status(400).json({ message: 'User not found. Please log in.' });
    }

    // Validate that the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Create a new inquiry
    const newInquiry = new Inquiry({
      userId,
      propertyId,
      message,
      contactInfo,
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry sent successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { propertyId, status } = req.query;

    // If the user is an admin, show all inquiries, else show only the user's inquiries
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = userId ? { userId } : {};

    if (propertyId) query.propertyId = propertyId;
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query).populate('propertyId').populate('userId');

    res.json({ inquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    // Check if the user is an admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
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

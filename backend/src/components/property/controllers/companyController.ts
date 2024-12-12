import { Request, Response } from 'express';
import Company from '../models/companyModel';
import Property from '../models/propertyModel';
import { v2 as cloudinary } from 'cloudinary';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, address, logo, website, description } =
      req.body;

    const existingCompany = await Company.findOne({ email }).exec();
    if (existingCompany) {
      return res
        .status(400)
        .json({ message: 'Company with this email already exists.' });
    }

    const company = new Company({
      name,
      email,
      phoneNumber,
      address,
      logo,
      website,
      description,
      properties: [],
      adminId: req.user._id, // Attach adminId from the authenticated user
    });

    await company.save();
    res.status(201).json({ message: 'Company created successfully!', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create company', error });
  }
};

// Get all companies
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find({ adminId: req.user._id }).exec();
    res.status(200).json({ companies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch companies', error });
  }
};

// Get a specific company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findOne({
      _id: companyId,
      adminId: req.user._id,
    }).exec();
    if (!company) {
      return res
        .status(404)
        .json({ message: 'Company not found or access denied' });
    }
    res.status(200).json({ company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch company', error });
  }
};

// Update a company
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;
    const updateData = req.body;

    const company = await Company.findOneAndUpdate(
      { _id: companyId, adminId: req.user._id }, // Ensure the company belongs to the admin
      updateData,
      { new: true }
    ).exec();

    if (!company) {
      return res
        .status(404)
        .json({ message: 'Company not found or access denied' });
    }
    res.status(200).json({ message: 'Company updated successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update company', error });
  }
};

// Delete a company
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findOne({
      _id: companyId,
      adminId: req.user._id,
    }).exec();
    if (!company) {
      return res
        .status(404)
        .json({ message: 'Company not found or access denied' });
    }

    const propertyCount = await Property.countDocuments({ company: companyId });
    if (propertyCount > 0) {
      return res.status(400).json({
        message: `Cannot delete company. It has ${propertyCount} associated properties.`,
      });
    }

    if (company.logoPublicId) {
      await cloudinary.uploader.destroy(company.logoPublicId);
    }

    await company.deleteOne();
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete company', error });
  }
};

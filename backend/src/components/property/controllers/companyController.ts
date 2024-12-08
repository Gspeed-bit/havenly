import { Request, Response } from 'express';
import Company from '../models/companyModel';
import Property from '../models/propertyModel';
import { StatusCodes } from 'utils/apiResponse';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, address, logo, website, description } =
      req.body;

    // Check if the company already exists
    const existingCompany = await Company.findOne({ email }).exec();
    if (existingCompany) {
      return res.status(400).json({
        message: 'Company with this email already exists.',
      });
    }

    // Create a new company object
    const company = new Company({
      name,
      email,
      phoneNumber,
      address,
      logo,
      website,
      description,
      properties: [], // Initially no properties assigned to the company
    });

    // Save the company to the database
    await company.save();

    // Send back the created company with its ID
    res.status(201).json({
      message: 'Company created successfully!',
      company: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create company', error });
  }
};

// Get all companies
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await Company.find().exec();
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
    const company = await Company.findById(companyId).exec();
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
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

    const company = await Company.findByIdAndUpdate(companyId, updateData, {
      new: true,
    }).exec();
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
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

    // Check if the company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check for associated properties
    const propertyCount = await Property.countDocuments({ company: companyId });
    if (propertyCount > 0) {
      return res.status(400).json({
        message: `Cannot delete company. It has ${propertyCount} associated properties.`,
        details: `Please delete or reassign the properties before deleting the company.`,
      });
    }

    // If no associated properties, delete the company
    await company.deleteOne();
    res
      .status(StatusCodes.SUCCESS)
      .json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to delete company', error });
  }
};

import { Request, Response } from 'express';
import Company from '../models/companyModel';
import Property from '../models/propertyModel';
import { v2 as cloudinary } from 'cloudinary';
import { uploadImageToCloudinary } from 'utils/cloudinary';

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

    // Find and update the company
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

    // Check if there's a new profile image uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const { secure_url, public_id } = await uploadImageToCloudinary(
        req.file.buffer,
        `company_image/${companyId}`
      );

      // If the company already has a logo, delete the previous one
      if (company.logoPublicId) {
        await cloudinary.uploader.destroy(company.logoPublicId);

        // Optionally delete the folder and associated resources
        const folderPath = `company_image/${companyId}`;
        const resources = await cloudinary.api.resources({
          prefix: folderPath,
        });
        if (resources.total_count > 0) {
          await cloudinary.api.delete_resources_by_prefix(folderPath);
        }

        // Attempt to delete the folder itself
        try {
          await cloudinary.api.delete_folder(folderPath);
        } catch (cloudinaryError) {
          console.error('Failed to delete Cloudinary folder:', cloudinaryError);
        }
      }

      // Update company with the new logo
      company.logo = secure_url;
      company.logoPublicId = public_id;
    }

    // Save the updated company data
    await company.save();

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

      const folderPath = `company_image/${companyId}`;

      // Adding the type parameter to ensure Cloudinary correctly identifies resources
      const resources = await cloudinary.api.resources({
        prefix: folderPath,
        type: 'upload', // This specifies the resource type to be uploaded images
      });

      if (resources.total_count > 0) {
        await cloudinary.api.delete_resources_by_prefix(folderPath);
      }

      try {
        await cloudinary.api.delete_folder(folderPath);
      } catch (cloudinaryError) {
        return res.status(500).json({
          message: 'Failed to delete Cloudinary folder',
          error: cloudinaryError,
        });
      }
    }

    await company.deleteOne();
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete company', error });
  }
};

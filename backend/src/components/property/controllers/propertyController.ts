import { Request, Response } from 'express';
import Company from '../models/companyModel';
import Property from '../models/propertyModel';
import mongoose from 'mongoose';

export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      images,
      price,
      location,
      propertyType,
      rooms,
      company,
      status,
      amenities,
      coordinates,
      isPublished,
      agent,
    } = req.body;

    // Check if user is admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Cast company to ObjectId
    const companyId = new mongoose.Types.ObjectId(company);

    // Ensure the company exists
    const existingCompany = await Company.findById(companyId);
    if (!existingCompany) {
      return res.status(400).json({ message: 'Invalid company ID.' });
    }

    // Create the property
    const newProperty = await Property.create({
      title,
      description,
      images,
      price,
      location,
      propertyType,
      rooms,
      company: companyId,
      status,
      amenities,
      coordinates,
      isPublished,
      agent,
    });

    // Add the property to the company's properties list
    existingCompany.properties.push(
      newProperty._id as mongoose.Schema.Types.ObjectId
    ); // Cast as ObjectId
    await existingCompany.save();

    res.status(201).json(newProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//update property by id

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the user is an admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Destructure only the necessary fields from the request body
    const {
      title,
      description,
      images,
      price,
      location,
      propertyType,
      rooms,
      company,
      status,
      amenities,
      coordinates,
      isPublished,
      agent,
    } = req.body;

    // Perform validation on the incoming data if needed
    if (price && price <= 0) {
      return res
        .status(400)
        .json({ message: 'Price must be greater than zero.' });
    }

    if (status && !['listed', 'sold', 'under contract'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    // Find the property by its ID and update it
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        title,
        description,
        images,
        price,
        location,
        propertyType,
        rooms,
        company,
        status,
        amenities,
        coordinates,
        isPublished,
        agent,
        updatedAt: new Date(), // Optionally update the timestamp
      },
      {
        new: true, // Return the updated document
        runValidators: true, // Validate the update operation
      }
    );

    // If the property is not found, return an error
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Respond with the updated property data
    res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//delete property by id
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the user is an admin
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Remove the property from the company's properties list
    await Company.updateOne(
      { _id: property.company },
      { $pull: { properties: property._id } }
    );

    res.json({ message: 'Property deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//get all properties
export const getProperties = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      propertyType,
      priceRange,
      rooms,
    } = req.query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    if (city) filters.location = { $regex: city, $options: 'i' };
    if (propertyType) filters.propertyType = propertyType;
    if (priceRange) {
      const [min, max] = (priceRange as string).split('-').map(Number);
      filters.price = { $gte: min, $lte: max };
    }
    if (rooms) filters.rooms = +rooms;

    // Fetch properties with the necessary filters
    const properties = await Property.find(filters)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .exec();

    const totalCount = await Property.countDocuments(filters);

    res.json({
      data: properties,
      pagination: {
        total: totalCount,
        currentPage: +page,
        totalPages: Math.ceil(totalCount / +limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

//get property by id

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

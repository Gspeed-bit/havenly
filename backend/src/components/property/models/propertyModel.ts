import mongoose, { Schema, Document } from 'mongoose';
import { ICompany } from './companyModel';

export interface IProperty extends Document {
  title: string;
  description: string;
  images: { url: string; public_id: string }[];
  price: number;
  location: string;
  propertyType: string;
  rooms: number;
  company: ICompany;
  status: 'listed' | 'under review' | 'sold'; // Enum for property status
  amenities: string[]; // List of amenities
  coordinates?: { lat: number; lng: number }; // Geolocation coordinates
  isPublished: boolean; // Indicates if the property is published
  agent?: { name: string; contact: string }; // Agent managing the property
  adminId: Schema.Types.ObjectId; // New field to store the admin's ID

  sold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true }, // Cloudinary URL
        public_id: { type: String, required: true }, // Cloudinary public_id
      },
    ],
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, required: true },
    rooms: { type: Number, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Reference to the company (property owner)
      required: true,
    },
    status: {
      type: String,
      enum: ['listed', 'sold', 'under review'],
      default: 'listed',
    },
    amenities: { type: [String], default: [] },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    isPublished: { type: Boolean, default: false },
    agent: {
      name: { type: String },
      contact: { type: String },
    },
    sold: { type: Boolean, default: false },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Admin ID who created the property
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Property = mongoose.model<IProperty>('Property', propertySchema);

export default Property;

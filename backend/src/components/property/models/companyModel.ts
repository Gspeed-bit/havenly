import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  logo: string;
  logoPublicId: string;
  website?: string; // Optional website URL
  description?: string; // Brief description about the company
  properties: mongoose.Schema.Types.ObjectId[]; // List of properties added by the company
  adminId: mongoose.Schema.Types.ObjectId[]; // List of properties added by the company
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /\S+@\S+\.\S+/,
    }, // Simple email validation
    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{6,15}$/,
      // Ensure the phone number has an optional '+' followed by exactly 10 digits
    },
    address: { type: String, required: true },
    logo: { type: String, required: false },
    logoPublicId: { type: String, required: false },
    website: { type: String },
    description: { type: String },
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property', // Links to the Property model
      },
    ],
    adminId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const Company = mongoose.model<ICompany>('Company', companySchema);

export default Company;

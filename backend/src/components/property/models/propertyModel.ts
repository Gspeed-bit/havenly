import mongoose, { Schema, Document } from 'mongoose';

interface IProperty extends Document {
  title: string;
  description: string;
  images: string[];
  price: number;
  location: string;
  propertyType: string;
  rooms: number;
  company: mongoose.Schema.Types.ObjectId; // Reference to the real estate company
  status: 'listed' | 'sold' | 'under review'; // Enum for property status
  amenities: string[]; // List of amenities
  coordinates?: { lat: number; lng: number }; // Geolocation coordinates
  isPublished: boolean; // Indicates if the property is published
  agent?: { name: string; contact: string }; // Agent managing the property
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, required: true },
    rooms: { type: Number, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Assuming a Company model exists
      required: true,
    },
    status: {
      type: String,
      enum: ['listed', 'sold', 'under review'],
      default: 'listed',
    },
    amenities: { type: [String], default: [] },
    coordinates: { 
      lat:Number,
      lng:Number
    },
    isPublished: { type: Boolean, default: false },
    agent: {
      name: { type: String },
      contact: { type: String },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Property = mongoose.model<IProperty>('Property', propertySchema);

export default Property;

import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types/userTypes';

const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: undefined }, // No null values stored
    resetPasswordCode: { type: String, default: undefined }, // No null values stored
    adminCode: { type: String, select: false }, // Hidden from database queries
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.adminCode; // Ensure `adminCode` is never in query results
        return ret;
      },
    },
  }
);

export default mongoose.model<IUser & Document>('User', userSchema);

import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types/userTypes';

const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
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
    confirmPassword: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationCode: {
      type: String,
      default: null,
      validate: {
        validator: function (value: string | null) {
          if (value === null) return true; // Allow null value
          return /^[A-Za-z0-9]{6}$/.test(value); // 6 characters, letters or digits
        },
        message:
          'Verification code must be a 6-character alphanumeric code if not verified.',
      },
    },
    verificationCodeExpiration: {
      type: Date,
      required: function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return !(this as any).isVerified; // Only required if not verified
      },
      default: function () {
        return new Date(Date.now() + 3600000); // Default to 1 hour from now if not verified
      },
    },
    resetPasswordCode: { type: String, default: undefined }, // Optional field
    resetPasswordExpiration: { type: Date }, // Optional field
    adminCode: { type: String, select: false },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.adminCode;
        return ret;
      },
    },
  }
);




userSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model<IUser & Document>('User', userSchema);
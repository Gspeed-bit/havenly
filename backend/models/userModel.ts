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
    confirmPassword: { type: String},
    isVerified: { type: Boolean, default: false },
    verificationCode: {
      type: String,
      default: null,
      validate: {
        validator: function (this: any, v: string | null) {
          if (!this.isVerified && (v === null || v === undefined)) {
            return false;
          }
          return v === null || /^[0-9]{6}$/.test(v);
        },
        message: 'Verification code must be a 6-digit number if not verified.',
      },
    },
    verificationCodeExpiration: { type: Date, required: true },
    resetPasswordCode: { type: String, default: undefined },
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

export default mongoose.model<IUser & Document>('User', userSchema);

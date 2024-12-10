import mongoose, { Document, Schema } from 'mongoose';

// Define the IUser TypeScript interface
export interface IUser {
  save(): unknown;
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  imgUrl?: string; // Optional profile image URL
  imgPublicId?: string; // Optional Cloudinary image ID
  confirmPassword: string;
  isVerified: boolean;
  verificationCode: string | null;
  verificationCodeExpiration: Date | null;
  resetPasswordCode?: string | null;
  resetPasswordExpiration?: Date | null;
  adminCode?: string;
  isAdmin: boolean;
}

// Define the user schema
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
    imgUrl: {
      type: String,
      default: null, // Optional, default to null
      validate: {
        validator: function (value: string | null) {
          if (value === null) return true; // Allow null value
          return /^https?:\/\/[^\s]+$/.test(value); // Basic URL validation
        },
        message: 'Please provide a valid URL.',
      },
    },
    imgPublicId: {
      type: String,
      default: null, // Optional, default to null
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
        delete ret.adminCode; // Exclude adminCode from JSON output
        return ret;
      },
    },
  }
);

// Add a virtual property for the full name
userSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Export the User model
export default mongoose.model<IUser & Document>('User', userSchema);

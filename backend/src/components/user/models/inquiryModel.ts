import mongoose, { Schema } from 'mongoose';

interface IInquiry extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  message: string;
  contactInfo: {
    email: string;
    phoneNumber: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}

const inquirySchema = new Schema<IInquiry>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    message: { type: String, required: true },
    contactInfo: {
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);

export default Inquiry;

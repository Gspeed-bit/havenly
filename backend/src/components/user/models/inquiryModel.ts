import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  propertyId: string;
  userId: string;
  message: string;
  isResponded: boolean;
  response: string;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: {
      type: mongoose.Schema.Types.String,
      ref: 'Property',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.String,
      ref: 'User',
      required: true,
    },
    message: { type: String, required: true },
    isResponded: { type: Boolean, default: false },
    response: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  message: string;
  status?: string;
  customMessage?: string;
}

const inquirySchema = new Schema<IInquiry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    message: { type: String, required: true },
    status: { type: String, default: 'Submitted' },
    customMessage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IInquiry>('Inquiry', inquirySchema);

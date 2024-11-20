import mongoose, { Schema, Document } from 'mongoose';

interface IInquiry extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  message: string;
  status: 'Submitted' | 'Under Review' | 'Answered';
  customMessage?: string;
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
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Answered'],
      default: 'Submitted',
    },
    customMessage: { type: String },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);

export default Inquiry;

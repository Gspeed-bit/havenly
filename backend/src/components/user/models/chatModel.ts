import { IProperty } from '@components/property/models/propertyModel';
import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: string;
  content: string;
  timestamp: Date;
  senderName: string;
}

export interface IChat extends Document {
  propertyId: mongoose.Types.ObjectId | IProperty; 
  users: mongoose.Types.ObjectId[];
  adminId: mongoose.Types.ObjectId;
  messages: IMessage[];
  isClosed: boolean;
}

const chatSchema = new Schema<IChat>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
      {
        sender: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        senderName: { type: String, required: true },
      },
    ],
    isClosed: { type: Boolean, default: false },
  },
  {
    versionKey: false, // Disable versioning for this schema
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model<IChat>('Chat', chatSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  receiverId: mongoose.Schema.Types.ObjectId;
  type: 'inquiry' | 'response';
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: { type: String, enum: ['inquiry', 'response',], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);

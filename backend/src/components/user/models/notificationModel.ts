import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  inquiryId: string;
  message: string;
  read: boolean;
  propertySold?: boolean;
}

interface NotificationModel extends Model<INotification> {
  markPropertyAsSold(propertyId: string): Promise<void>;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  inquiryId: { type: Schema.Types.ObjectId, ref: 'Inquiry', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  propertySold: { type: Boolean, default: false },
});

NotificationSchema.statics.markPropertyAsSold = async function (
  propertyId: string
) {
  await this.updateMany(
    { 'inquiryId.propertyId': propertyId },
    { $set: { propertySold: true } }
  );
};

export default mongoose.model<INotification, NotificationModel>(
  'Notification',
  NotificationSchema
);

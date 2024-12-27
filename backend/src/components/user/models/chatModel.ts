import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  sender: 'user' | 'admin';
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  propertyId: mongoose.Schema.Types.ObjectId;
  users: mongoose.Schema.Types.ObjectId[]; // Array of user IDs
  adminId: mongoose.Schema.Types.ObjectId;
  messages: IMessage[];
  isClosed: boolean; // Indicates if the chat is closed
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new Schema<IChat>(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    }, // Updated

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: { type: [messageSchema], default: [] },
    isClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;

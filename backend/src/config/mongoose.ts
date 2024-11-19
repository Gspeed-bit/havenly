import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { KEYS } from './config';

dotenv.config(); // Load environment variables

const mongoURI = KEYS.mongoUri;

if (!mongoURI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let isConnected = false; // Track the connection status

export const connectToMongoose = async () => {
  if (isConnected) {
    console.log('Database is already connected');
    return;
  }

  try {
    await mongoose.connect(mongoURI, {});
    isConnected = !!mongoose.connection.readyState; // 1 means connected
    console.log('Mongoose connected successfully');
  } catch (error) {
    console.error('Mongoose connection error:', error);
    throw new Error('Failed to connect to Mongoose');
  }
};

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

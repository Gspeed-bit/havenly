// backend/index.ts
import express from 'express';
import { connectToMongoose } from './config/mongoose'; // Adjust path as needed

const app = express();

// Connect to MongoDB
connectToMongoose();

// Middleware and routes
// app.use('/api', yourRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

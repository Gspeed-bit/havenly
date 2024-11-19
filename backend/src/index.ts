// backend/index.ts
import { KEYS } from 'config/config';
import { connectToMongoose } from 'config/mongoose';
import express from 'express';


const app = express();

// Connect to MongoDB
connectToMongoose();


app.listen(KEYS.port, () => {
  console.log(`Server is running on port ${KEYS.port}`);
});

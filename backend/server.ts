import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'; // Your routes
import dotenv from 'dotenv';
import { connectToMongoose } from './config/mongoose'; // Import the mongoose connection function
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import cron from 'node-cron'; // Import node-cron
import User from './models/userModel'; // Import User model

dotenv.config(); // Load environment variables

const app = express();

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Havenly API',
      version: '1.0.0',
      description: 'API documentation for Havenly project',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.ts'], // Specify your route files
};

export default swaggerOptions;

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use('/api/auth', authRoutes); // All routes under /api/auth
app.use('/user', userRoutes); // All routes under /user/me

// MongoDB connection
connectToMongoose()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Schedule a cron job to clean up expired verification codes every 24 hours (at midnight)
cron.schedule('0 0 * * *', async () => {
  // Runs at midnight every day
  const now = new Date();
  try {
    await User.updateMany(
      { verificationCodeExpiration: { $lt: now } },
      { $set: { verificationCode: null, verificationCodeExpiration: null } }
    );
    console.log('Cleaned up expired verification codes');
  } catch (error) {
    console.error('Error cleaning up expired verification codes:', error);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

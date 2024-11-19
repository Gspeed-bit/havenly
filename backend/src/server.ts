import express from 'express';
import cors from 'cors';
import authRoutes from './components/user/routes/authRoutes'; // Your routes
import dotenv from 'dotenv';
import { connectToMongoose } from './config/mongoose'; // Import the mongoose connection function
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './components/user/routes/userRoutes';
import cron from 'node-cron'; // Import node-cron
import User from '@models/userModel'; // Import User model
import basicAuth from 'express-basic-auth'; // Import basic-auth
import { KEYS } from './config/config';
import propertyRoutes from 'components/property/routes/propertyRoutes';
import companyRoutes from 'components/property/routes/companyRoutes';
import inquiryRoutes from '@controllers/routes/inquiryRoutes';

dotenv.config({ path: '.env' });

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
      contact: {
        name: 'Havenly dev team',
        email: 'Havenlydev@gmail.com',
      },
    },
    servers: [
      {
        url: `http://${KEYS.host}:${KEYS.port}`,
        description: `${KEYS.appEnv} Server`,
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
  apis: [
    './src/components/user/routes/**/*.ts',
    './src/components/property/routes/**/*.ts',
  ], // Specify your route files
};

export default swaggerOptions;

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Set up basic authentication
app.use(
  '/api-docs', // Protect this route with authentication
  basicAuth({
    users: {
      [KEYS.serverUsername]: KEYS.serverPassword, // Dynamically use env variables
    },
    challenge: true, // Will prompt the user with a login dialog
    realm: 'Protected API', // This is the prompt message
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// app.use('/', authRoutes, propertyRoutes, companyRoutes); // All routes under /api/auth

app.use('/', authRoutes); // All routes under /api/auth
app.use('/', companyRoutes); // All routes under /api/auth
app.use('/', propertyRoutes); // All routes under /api/auth
app.use('/', inquiryRoutes); // All routes under /api/auth

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
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

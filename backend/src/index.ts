import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import cron from 'node-cron';
import basicAuth from 'express-basic-auth';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { connectToMongoose } from './config/mongoose'; // Import the mongoose connection function
import { KEYS } from './config/config';
import User from '@components/user/models/userModel'; // Import the User model
import { Server } from 'socket.io';
import http from 'http';
// Routes
import authRoutes from './components/user/routes/authRoutes';
import userRoutes from './components/user/routes/userRoutes';
import propertyRoutes from 'components/property/routes/propertyRoutes';
import companyRoutes from 'components/property/routes/companyRoutes';
import notificationRoutes from '@components/user/routes/notificationRoutes';
import inquiryRoutes from '@components/user/routes/inquiryRoutes';
import imageRoutes from '@components/imageUpload/routes/imageRoutes';

dotenv.config({ path: '.env' });

const app = express();
const server = http.createServer(app);

// Create Socket.io instance with specific CORS for frontend
const io = new Server(server, {
  cors: {
    // Only allow frontend URL since that's where client connections will come from
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('New client connected');

  const userId = socket.handshake.auth.userId;
  if (userId) {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  }

  socket.on('disconnect', () => {
    if (userId) {
      socket.leave(userId);
      console.log(`User ${userId} left their room`);
    }
    console.log('Client disconnected');
  });
});

// Make io available to your routes
app.set('io', io);

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://havenly-chdr.onrender.com',
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Havenly backend!');
});
app.use(
  '/',
  authRoutes,
  propertyRoutes,
  companyRoutes,
  notificationRoutes,
  inquiryRoutes
);
app.use('/user', userRoutes); // All routes under /user/me
app.use('/image', imageRoutes); // All routes under /image

// MongoDB connection
connectToMongoose()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

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
        url: `${KEYS.serverHost}`,
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
    './src/components/imageUpload/routes/**/*.ts',
  ],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  basicAuth({
    users: {
      [KEYS.serverUsername]: KEYS.serverPassword,
    },
    challenge: true,
    realm: 'Protected API',
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

// Cron job for cleaning up expired verification codes
cron.schedule('0 0 * * *', async () => {
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
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

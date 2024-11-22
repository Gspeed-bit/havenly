import express from 'express';
import http from 'http';
import { Request, Response } from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './components/user/routes/authRoutes'; // Your routes
import dotenv from 'dotenv';
import { connectToMongoose } from './config/mongoose'; // Import the mongoose connection function
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './components/user/routes/userRoutes';
import cron from 'node-cron'; // Import node-cron
import basicAuth from 'express-basic-auth'; // Import basic-auth
import { KEYS } from './config/config';
import propertyRoutes from 'components/property/routes/propertyRoutes';
import companyRoutes from 'components/property/routes/companyRoutes';
import notificationRoutes from '@components/user/routes/notificationRoutes';
import inquiryRoutes from '@components/user/routes/inquiryRoutes';
import User from '@components/user/models//userModel'; // Import the User model




dotenv.config({ path: '.env' });

const app = express();
// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Havenly backend!');
});
const server = http.createServer(app);

// Initialize Socket.IO with CORS support
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware to attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});
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


app.use(
  '/',
  authRoutes,
  propertyRoutes,
  companyRoutes,
  notificationRoutes ,
  inquiryRoutes
);

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

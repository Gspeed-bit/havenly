'use strict';
import express from 'express';
import cors from 'cors';
import nodeCron from 'node-cron';
import expressBasicAuth from 'express-basic-auth';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import http from 'http';
import { Server } from 'socket.io';
import { connectToMongoose } from './config/mongoose';
import { KEYS } from './config/config';
import userModel from './components/user/models/userModel'; // Import the User model

// Import routes
import authRoutes from './components/user/routes/authRoutes';
import userRoutes from './components/user/routes/userRoutes';
import propertyRoutes from './components/property/routes/propertyRoutes';
import companyRoutes from './components/property/routes/companyRoutes';
import notificationRoutes from './components/user/routes/notificationRoutes';
import imageRoutes from './components/imageUpload/routes/imageRoutes';
import chatRoutes from './components/user/routes/chatRoutes';
import { storeMessage } from '@components/user/controllers/chatController';
import Chat from '@components/user/models/chatModel';

// Load environment variables
dotenv.config({ path: '.env' });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('adminJoin', (adminId: string) => {
    socket.join(`admin:${adminId}`);
  });

  socket.on('joinChat', (chatId: string) => {
    socket.join(chatId);
  });

  socket.on(
    'sendMessage',
    async (data: {
      chatId: string;
      content: string;
      sender: 'user' | 'admin';
    }) => {
      const { chatId, content, sender } = data;

      try {
        const newMessage = await storeMessage(chatId, content, sender);
        io.to(chatId).emit('receiveMessage', newMessage);

        const chat = await Chat.findById(chatId);
        if (chat && sender === 'user') {
          io.to(`admin:${chat.adminId}`).emit('newMessageNotification', {
            message: `New message in chat ${chatId}`,
            chatId,
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  );

  socket.on('closeChat', async (chatId: string) => {
    try {
      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { isClosed: true },
        { new: true }
      );
      if (chat) {
        io.to(chatId).emit('chatClosed', {
          message: 'This chat has been closed.',
        });
      }
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000', // Frontend dev server
      'http://localhost:5000', // Backend dev server
      'https://havenly-chdr.onrender.com', // Production frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies or authentication headers
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Havenly backend!');
});

app.use(
  '/',
  authRoutes,
  propertyRoutes,
  companyRoutes,
  notificationRoutes,
  chatRoutes(io)
);
app.use('/user', userRoutes); // All routes under /user
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

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use(
  '/api-docs',
  expressBasicAuth({
    users: {
      [KEYS.serverUsername]: KEYS.serverPassword,
    },
    challenge: true,
    realm: 'Protected API',
  }),
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs)
);

// Cron job for cleaning up expired verification codes
nodeCron.schedule('0 0 * * *', async () => {
  const now = new Date();
  try {
    await userModel.updateMany(
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

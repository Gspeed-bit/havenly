import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // Frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Extract user type from the handshake query
    const isAdmin = socket.handshake.query.isAdmin === 'true'; // Check for string 'true' explicitly

    // Listen for the 'new_inquiry' event
    socket.on('new_inquiry', (data) => {
      console.log('New inquiry received:', data);
    });
    if (isAdmin) {
      socket.join('admin-room'); // Admin joins the admin-room
      console.log(`Socket ${socket.id} joined admin-room`);
    } else {
      socket.join('user-room'); // Non-admin users join user-room
      console.log(`Socket ${socket.id} joined user-room`);
    }

    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`);
    });
  });
};

export const getSocket = (): Server => {
  if (!io) throw new Error('Socket.IO has not been initialized!');
  return io;
};

export interface InquiryNotificationData {
  propertyId: string;
  userId: string;
  message: string;
}

// Notify the admin about a new inquiry
export const notifyAdminOnInquiry = (data: InquiryNotificationData): void => {
  try {
    const io = getSocket();
    io.to('admin-room').emit('new_inquiry', data); // Emit event to admin-room
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

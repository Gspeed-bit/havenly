'use client';

import { io } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:5000';

const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export const joinRoom = (roomId: string) => {
  socket.emit('joinRoom', roomId);
};

export default socket;

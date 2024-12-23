import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  initializeSocket: (userId: string) => void;
  sendInquiry: (data: {
    propertyId: string;
    userId: string;
    message: string;
  }) => void;
  respondToInquiry: (data: { userId: string; message: string }) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,

  initializeSocket: (userId: string) => {
    if (get().socket) {
      console.log('Socket already initialized.');
      return;
    }

    const socket = io('http://localhost:5000', {
      auth: { userId },
    });

    socket.on('connect', () => {
      console.log(`Socket connected: ${socket.id}`);
    });

    socket.on('inquiryAlert', (data) => {
      console.log('Admin received new inquiry:', data);
      alert('New inquiry received!');
    });

    socket.on('responseAlert', (data) => {
      console.log('User received response:', data);
      alert('Admin has responded to your inquiry.');
    });

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });

    set({ socket });
  },

  sendInquiry: (data) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('newInquiry', data);
    }
  },

  respondToInquiry: (data) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('respondToInquiry', data);
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      console.log('Socket disconnected and cleaned up.');
      set({ socket: null });
    }
  },
}));

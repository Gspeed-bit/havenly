import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketStore {
  socket: Socket | null;
  initializeSocket: (isAdmin: boolean, userId: string) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  initializeSocket: (isAdmin: boolean, userId: string) => {
    // Avoid creating multiple sockets
    set((state) => {
      if (state.socket) return {}; // Don't initialize if already connected
      const socket = io('http://localhost:5000', {
        query: { isAdmin: isAdmin ? 'true' : 'false', userId },
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        transports: ['websocket'],
      });

      // Set socket in the state
      return { socket };
    });
  },
  disconnectSocket: () => {
    // Disconnect socket if it's already connected
    set((state) => {
      if (state.socket) {
        state.socket.disconnect();
        return { socket: null };
      }
      return {};
    });
  },
}));

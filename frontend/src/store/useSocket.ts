import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(url, { transports: ['websocket'] });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = useCallback((eventName: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const on = useCallback((eventName: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  }, []);

  const off = useCallback((eventName: string) => {
    if (socketRef.current) {
      socketRef.current.off(eventName);
    }
  }, []);

  return { emit, on, off };
};

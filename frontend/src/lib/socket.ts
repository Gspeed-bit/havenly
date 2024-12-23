import { useSocketStore } from '@/store/socket';
import { useUserStore } from '@/store/users';
import { useEffect } from 'react';

const useSocket = () => {
  const { socket, initializeSocket, disconnectSocket } = useSocketStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      if (user._id) {
        initializeSocket(user.isAdmin ? 'admin' : user._id);
      }
    }

    return () => {
      disconnectSocket();
    };
  }, [user, initializeSocket, disconnectSocket]);

  return socket;
};

export default useSocket;

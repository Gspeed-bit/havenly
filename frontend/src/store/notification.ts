import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void; // Changed to accept a Notification object
  markAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [] as Notification[],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now().toString() }, // Ensure a unique ID is generated
      ],
    })),
  markAsRead: () => set({ notifications: [] }),
}));

import { apiHandler } from '@/config/server';

export interface Notification {
  _id: string;
  userId: string;
  inquiryId?: string;
  message: string;
  read: boolean;
  propertySold: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fetch notifications for a specific user
export const getNotifications = async (userId: string) => {
  const response = await apiHandler<{ notifications: Notification[] }>(
    `/notifications/${userId}`, // Replace with your actual endpoint
    'GET'
  );

  if (response.status === 'success') {
    return response.data.notifications;
  } else {
    console.error('Error fetching notifications:', response.message);
    return [];
  }
};
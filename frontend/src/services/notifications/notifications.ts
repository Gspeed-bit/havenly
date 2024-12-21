import { apiHandler, SuccessResponse } from '@/config/server';

interface Notification {
  _id: string;
  userId: string;
  inquiryId: string;
  message: string;
  read: boolean;
  propertySold?: boolean;
  createdAt: string;
}

export const fetchNotifications = async (): Promise<
  SuccessResponse<Notification[]>
> => {
  const response = await apiHandler('/notifications', 'GET');
  if (response.status === 'success') {
    return {
      status: 'success',
      message: response.message,
      data: response.data as Notification[],
    };
  }
  throw new Error(response.message);
};

export const markNotificationAsRead = async (
  id: string
): Promise<SuccessResponse<Notification>> => {
  const response = await apiHandler<Notification>(
    `/notifications/${id}`,
    'PUT'
  );
  if (response.status === 'success') {
    return {
      status: 'success',
      message: response.message,
      data: response.data as Notification,
    };
  }
  throw new Error(response.message);
};

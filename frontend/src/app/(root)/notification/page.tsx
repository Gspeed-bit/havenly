import UserInquiries from '@/components/pages/inquiries/InquiriesPage';
import NotificationSection from '@/components/pages/notification/Notifications';

import React from 'react';

const page = () => {
  return (
    <div>
      <h1>User Notifications</h1>

      <NotificationSection />
      <UserInquiries />
    </div>
  );
};

export default page;

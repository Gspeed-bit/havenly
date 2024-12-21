'use client';

import CreateInquiry from '@/components/pages/inquiries/CreateInquiry';
import InquiryList from '@/components/pages/inquiries/InquiryList';
import React from 'react';

const InquiriesPage: React.FC = () => {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Inquiries</h1>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>Create New Inquiry</h2>
        <CreateInquiry propertyId='' onInquirySent={() => {}} />
      </div>
      <div>
        <h2 className='text-xl font-semibold mb-2'>Inquiry List</h2>
        <InquiryList />
      </div>
    </div>
  );
};

export default InquiriesPage;

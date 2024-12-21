'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Inquiry, updateInquiryStatus } from '@/services/inquiry/inquiryService';

interface UpdateInquiryStatusProps {
  inquiry: Inquiry;
  onStatusUpdated: () => void;
}

const UpdateInquiryStatus: React.FC<UpdateInquiryStatusProps> = ({
  inquiry,
  onStatusUpdated,
}) => {
  const [newStatus, setNewStatus] = useState<
    'Submitted' | 'Under Review' | 'Answered'
  >(inquiry.status);
  const [customMessage, setCustomMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    const response = await updateInquiryStatus(
      inquiry._id,
      newStatus,
      customMessage
    );
    setIsLoading(false);

    if (response.status === 'success') {
      toast({
        title: 'Status Updated',
        description: 'The inquiry status has been successfully updated.',
      });
      onStatusUpdated();
    } else {
      toast({
        title: 'Error',
        description: response.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='mt-4 space-y-2'>
      <select
        value={newStatus}
        onChange={(e) =>
          setNewStatus(
            e.target.value as 'Submitted' | 'Under Review' | 'Answered'
          )
        }
        className='w-full p-2 border rounded'
      >
        <option value='Submitted'>Submitted</option>
        <option value='Under Review'>Under Review</option>
        <option value='Answered'>Answered</option>
      </select>
      <Input
        type='text'
        placeholder='Custom message (optional)'
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
      />
      <Button
        onClick={handleStatusUpdate}
        disabled={isLoading || newStatus === inquiry.status}
      >
        {isLoading ? 'Updating...' : 'Update Status'}
      </Button>
    </div>
  );
};

export default UpdateInquiryStatus;

'use client';

import { Button } from '@/components/ui/button';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className='flex justify-center gap-5 items-center mt-6'>
      <Button
        disabled={currentPage === 1}
        onClick={onPrevious}
        variant='outline'
      >
        Previous
      </Button>
      <p>
        Page {currentPage} of {totalPages}
      </p>
      <Button
        disabled={currentPage === totalPages}
        onClick={onNext}
        variant='outline'
      >
        Next
      </Button>
    </div>
  );
}

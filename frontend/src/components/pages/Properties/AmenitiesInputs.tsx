import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CheckIcon, PlusCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultAmenities = [
  'Pool',
  'Gym',
  'Parking',
  'Wi-Fi',
  'Air Conditioning',
  'Elevator',
  'Balcony',
  'Garden',
  'Security System',
  'Laundry',
];

interface AmenitiesInputProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

export function AmenitiesInput({
  selectedAmenities,
  onChange,
}: AmenitiesInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSelect = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onChange(selectedAmenities.filter((item) => item !== amenity));
    } else {
      onChange([...selectedAmenities, amenity]);
    }
  };

  const handleAddCustom = () => {
    if (inputValue && !selectedAmenities.includes(inputValue)) {
      onChange([...selectedAmenities, inputValue]);
      setInputValue('');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full justify-start'>
          {selectedAmenities.length > 0 ? (
            <>
              <Badge variant='secondary' className='mr-2'>
                {selectedAmenities.length}
              </Badge>
              {selectedAmenities.length > 2
                ? `${selectedAmenities.slice(0, 2).join(', ')} ...`
                : selectedAmenities.join(', ')}
            </>
          ) : (
            'Select amenities'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <Command>
          <CommandInput
            placeholder='Search amenities'
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={handleAddCustom}
            >
              <PlusCircleIcon className='mr-2 h-4 w-4' />
              Add "{inputValue}"
            </Button>
          </CommandEmpty>
          <CommandGroup>
            {defaultAmenities.map((amenity) => (
              <CommandItem key={amenity} onSelect={() => handleSelect(amenity)}>
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedAmenities.includes(amenity)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {amenity}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
